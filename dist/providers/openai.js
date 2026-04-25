/**
 * OpenAI Chat Completions API Provider
 *
 * Converts between the SDK's internal Anthropic-like message format
 * and OpenAI's Chat Completions API format.
 *
 * Uses native fetch (no openai SDK dependency required).
 */
// --------------------------------------------------------------------------
// Provider
// --------------------------------------------------------------------------
export class OpenAIProvider {
    apiType = 'openai-completions';
    apiKey;
    baseURL;
    constructor(opts) {
        this.apiKey = opts.apiKey || '';
        this.baseURL = (opts.baseURL || 'https://api.openai.com/v1').replace(/\/$/, '');
    }
    async createMessage(params) {
        // Convert to OpenAI format
        const messages = this.convertMessages(params.system, params.messages);
        const tools = params.tools ? this.convertTools(params.tools) : undefined;
        const body = {
            model: params.model,
            max_tokens: params.maxTokens,
            messages,
        };
        if (tools && tools.length > 0) {
            body.tools = tools;
        }
        // Make API call
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errBody = await response.text().catch(() => '');
            const err = new Error(`OpenAI API error: ${response.status} ${response.statusText}: ${errBody}`);
            err.status = response.status;
            throw err;
        }
        const data = (await response.json());
        // Convert response back to normalized format
        return this.convertResponse(data);
    }
    async *createMessageStream(params) {
        const messages = this.convertMessages(params.system, params.messages);
        const tools = params.tools ? this.convertTools(params.tools) : undefined;
        const body = {
            model: params.model,
            max_tokens: params.maxTokens,
            messages,
            stream: true,
            stream_options: { include_usage: true },
        };
        if (tools && tools.length > 0) {
            body.tools = tools;
        }
        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errBody = await response.text().catch(() => '');
            const err = new Error(`OpenAI API error: ${response.status} ${response.statusText}: ${errBody}`);
            err.status = response.status;
            throw err;
        }
        // Accumulate tool calls across chunks
        const toolCallAccum = {};
        let textContent = '';
        let finishReason = 'stop';
        let usage = { prompt_tokens: 0, completion_tokens: 0 };
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed === 'data: [DONE]')
                    continue;
                if (!trimmed.startsWith('data: '))
                    continue;
                let chunk;
                try {
                    chunk = JSON.parse(trimmed.slice(6));
                }
                catch {
                    continue;
                }
                // Usage chunk (stream_options)
                if (chunk.usage) {
                    usage = chunk.usage;
                }
                const choice = chunk.choices?.[0];
                if (!choice)
                    continue;
                if (choice.finish_reason)
                    finishReason = choice.finish_reason;
                const delta = choice.delta;
                if (!delta)
                    continue;
                // Text delta
                if (delta.content) {
                    textContent += delta.content;
                    yield { type: 'text_delta', delta: delta.content };
                }
                // Tool call deltas
                if (delta.tool_calls) {
                    for (const tc of delta.tool_calls) {
                        const idx = tc.index ?? 0;
                        if (!toolCallAccum[idx]) {
                            toolCallAccum[idx] = { id: tc.id || '', name: tc.function?.name || '', arguments: '' };
                        }
                        if (tc.id)
                            toolCallAccum[idx].id = tc.id;
                        if (tc.function?.name)
                            toolCallAccum[idx].name = tc.function.name;
                        if (tc.function?.arguments) {
                            toolCallAccum[idx].arguments += tc.function.arguments;
                            yield {
                                type: 'tool_use_delta',
                                id: toolCallAccum[idx].id,
                                name: toolCallAccum[idx].name,
                                input_delta: tc.function.arguments,
                            };
                        }
                    }
                }
            }
        }
        // Build normalized content
        const content = [];
        if (textContent)
            content.push({ type: 'text', text: textContent });
        for (const tc of Object.values(toolCallAccum)) {
            let input = {};
            try {
                input = JSON.parse(tc.arguments);
            }
            catch { /* empty */ }
            content.push({ type: 'tool_use', id: tc.id, name: tc.name, input });
        }
        if (content.length === 0)
            content.push({ type: 'text', text: '' });
        yield {
            type: 'message_stop',
            response: {
                content,
                stopReason: this.mapFinishReason(finishReason),
                usage: {
                    input_tokens: usage.prompt_tokens,
                    output_tokens: usage.completion_tokens,
                },
            },
        };
    }
    // --------------------------------------------------------------------------
    // Message Conversion: Internal → OpenAI
    // --------------------------------------------------------------------------
    convertMessages(system, messages) {
        const result = [];
        // System prompt as first message
        if (system) {
            result.push({ role: 'system', content: system });
        }
        for (const msg of messages) {
            if (msg.role === 'user') {
                this.convertUserMessage(msg, result);
            }
            else if (msg.role === 'assistant') {
                this.convertAssistantMessage(msg, result);
            }
        }
        return result;
    }
    convertUserMessage(msg, result) {
        if (typeof msg.content === 'string') {
            result.push({ role: 'user', content: msg.content });
            return;
        }
        // Content blocks may contain text and/or tool_result blocks
        const textParts = [];
        const toolResults = [];
        for (const block of msg.content) {
            if (block.type === 'text') {
                textParts.push(block.text);
            }
            else if (block.type === 'tool_result') {
                toolResults.push({
                    tool_use_id: block.tool_use_id,
                    content: block.content,
                });
            }
        }
        // Tool results become separate tool messages
        for (const tr of toolResults) {
            result.push({
                role: 'tool',
                tool_call_id: tr.tool_use_id,
                content: tr.content,
            });
        }
        // Text parts become a user message
        if (textParts.length > 0) {
            result.push({ role: 'user', content: textParts.join('\n') });
        }
    }
    convertAssistantMessage(msg, result) {
        if (typeof msg.content === 'string') {
            result.push({ role: 'assistant', content: msg.content });
            return;
        }
        // Extract text and tool_use blocks
        const textParts = [];
        const toolCalls = [];
        for (const block of msg.content) {
            if (block.type === 'text') {
                textParts.push(block.text);
            }
            else if (block.type === 'tool_use') {
                toolCalls.push({
                    id: block.id,
                    type: 'function',
                    function: {
                        name: block.name,
                        arguments: typeof block.input === 'string'
                            ? block.input
                            : JSON.stringify(block.input),
                    },
                });
            }
        }
        const assistantMsg = {
            role: 'assistant',
            content: textParts.length > 0 ? textParts.join('\n') : null,
        };
        if (toolCalls.length > 0) {
            assistantMsg.tool_calls = toolCalls;
        }
        result.push(assistantMsg);
    }
    // --------------------------------------------------------------------------
    // Tool Conversion: Internal → OpenAI
    // --------------------------------------------------------------------------
    convertTools(tools) {
        return tools.map((t) => ({
            type: 'function',
            function: {
                name: t.name,
                description: t.description,
                parameters: t.input_schema,
            },
        }));
    }
    // --------------------------------------------------------------------------
    // Response Conversion: OpenAI → Internal
    // --------------------------------------------------------------------------
    convertResponse(data) {
        const choice = data.choices[0];
        if (!choice) {
            return {
                content: [{ type: 'text', text: '' }],
                stopReason: 'end_turn',
                usage: { input_tokens: 0, output_tokens: 0 },
            };
        }
        const content = [];
        // Add text content
        if (choice.message.content) {
            content.push({ type: 'text', text: choice.message.content });
        }
        // Add tool calls
        if (choice.message.tool_calls) {
            for (const tc of choice.message.tool_calls) {
                let input;
                try {
                    input = JSON.parse(tc.function.arguments);
                }
                catch {
                    input = tc.function.arguments;
                }
                content.push({
                    type: 'tool_use',
                    id: tc.id,
                    name: tc.function.name,
                    input,
                });
            }
        }
        // If no content at all, add empty text
        if (content.length === 0) {
            content.push({ type: 'text', text: '' });
        }
        // Map finish_reason to our normalized stop reasons
        const stopReason = this.mapFinishReason(choice.finish_reason);
        return {
            content,
            stopReason,
            usage: {
                input_tokens: data.usage?.prompt_tokens || 0,
                output_tokens: data.usage?.completion_tokens || 0,
            },
        };
    }
    mapFinishReason(reason) {
        switch (reason) {
            case 'stop':
                return 'end_turn';
            case 'length':
                return 'max_tokens';
            case 'tool_calls':
                return 'tool_use';
            default:
                return reason;
        }
    }
}
//# sourceMappingURL=openai.js.map
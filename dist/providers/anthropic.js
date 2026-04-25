/**
 * Anthropic Messages API Provider
 *
 * Wraps the @anthropic-ai/sdk client. Since our internal format is
 * Anthropic-like, this is mostly a thin pass-through.
 */
import Anthropic from '@anthropic-ai/sdk';
export class AnthropicProvider {
    apiType = 'anthropic-messages';
    client;
    constructor(opts) {
        this.client = new Anthropic({
            apiKey: opts.apiKey,
            baseURL: opts.baseURL,
        });
    }
    async createMessage(params) {
        const requestParams = {
            model: params.model,
            max_tokens: params.maxTokens,
            system: params.system,
            messages: params.messages,
            tools: params.tools
                ? params.tools
                : undefined,
        };
        // Add extended thinking if configured
        if (params.thinking?.type === 'enabled' && params.thinking.budget_tokens) {
            requestParams.thinking = {
                type: 'enabled',
                budget_tokens: params.thinking.budget_tokens,
            };
        }
        const response = await this.client.messages.create(requestParams);
        return {
            content: response.content,
            stopReason: response.stop_reason || 'end_turn',
            usage: {
                input_tokens: response.usage.input_tokens,
                output_tokens: response.usage.output_tokens,
                cache_creation_input_tokens: response.usage.cache_creation_input_tokens,
                cache_read_input_tokens: response.usage.cache_read_input_tokens,
            },
        };
    }
    async *createMessageStream(params) {
        const requestParams = {
            model: params.model,
            max_tokens: params.maxTokens,
            system: params.system,
            messages: params.messages,
            tools: params.tools ? params.tools : undefined,
            stream: true,
        };
        if (params.thinking?.type === 'enabled' && params.thinking.budget_tokens) {
            requestParams.thinking = {
                type: 'enabled',
                budget_tokens: params.thinking.budget_tokens,
            };
        }
        // Accumulate full response for message_stop
        const content = [];
        let stopReason = 'end_turn';
        let usage = { input_tokens: 0, output_tokens: 0 };
        // Track current tool_use block being streamed
        let currentToolUse = null;
        const stream = this.client.messages.stream(requestParams);
        for await (const event of stream) {
            if (event.type === 'content_block_start') {
                if (event.content_block.type === 'tool_use') {
                    currentToolUse = {
                        id: event.content_block.id,
                        name: event.content_block.name,
                        input_json: '',
                    };
                }
            }
            else if (event.type === 'content_block_delta') {
                const delta = event.delta;
                if (delta.type === 'text_delta') {
                    yield { type: 'text_delta', delta: delta.text };
                }
                else if (delta.type === 'input_json_delta' && currentToolUse) {
                    currentToolUse.input_json += delta.partial_json;
                    yield {
                        type: 'tool_use_delta',
                        id: currentToolUse.id,
                        name: currentToolUse.name,
                        input_delta: delta.partial_json,
                    };
                }
            }
            else if (event.type === 'content_block_stop') {
                if (currentToolUse) {
                    let input = {};
                    try {
                        input = JSON.parse(currentToolUse.input_json);
                    }
                    catch { /* empty input */ }
                    content.push({ type: 'tool_use', id: currentToolUse.id, name: currentToolUse.name, input });
                    currentToolUse = null;
                }
            }
            else if (event.type === 'message_delta') {
                const delta = event.delta;
                if (delta.stop_reason)
                    stopReason = delta.stop_reason;
                if (event.usage) {
                    usage.output_tokens = event.usage.output_tokens || 0;
                }
            }
            else if (event.type === 'message_start') {
                const msg = event.message;
                if (msg?.usage) {
                    usage.input_tokens = msg.usage.input_tokens || 0;
                    usage.cache_creation_input_tokens = msg.usage.cache_creation_input_tokens;
                    usage.cache_read_input_tokens = msg.usage.cache_read_input_tokens;
                }
            }
        }
        // Collect text blocks from the final message
        const finalMsg = await stream.finalMessage();
        for (const block of finalMsg.content) {
            if (block.type === 'text' && block.text) {
                // Only add if not already tracked via deltas
                if (!content.find(b => b.type === 'text')) {
                    content.push({ type: 'text', text: block.text });
                }
            }
        }
        // Rebuild content from final message for accuracy
        const normalizedContent = finalMsg.content
            .filter(b => b.type === 'text' || b.type === 'tool_use')
            .map(b => {
            if (b.type === 'text')
                return { type: 'text', text: b.text };
            const tu = b;
            return { type: 'tool_use', id: tu.id, name: tu.name, input: tu.input };
        });
        yield {
            type: 'message_stop',
            response: {
                content: normalizedContent,
                stopReason: finalMsg.stop_reason || stopReason,
                usage: {
                    input_tokens: finalMsg.usage.input_tokens,
                    output_tokens: finalMsg.usage.output_tokens,
                    cache_creation_input_tokens: finalMsg.usage.cache_creation_input_tokens,
                    cache_read_input_tokens: finalMsg.usage.cache_read_input_tokens,
                },
            },
        };
    }
}
//# sourceMappingURL=anthropic.js.map
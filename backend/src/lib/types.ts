export type MistralResponse = {
    request_id: number,
    response_id: number,
    model: "mistral-nemo-instruct-2407",
    provider: "evraz",
    choices: [
        {
            index: number,
            message: {
                role: "assistant",
                content: string
            }
        }
    ],
    usage: {
        prompt_tokens: number,
        total_tokens: number,
        tokens_per_second: number,
        completion_tokens: number
    },
    timestamps: {
        request_time: Date,
        start_time_generation: Date,
        end_time_generation: Date,
        queue_wait_time: number,
        generation_time: number
    }
}

export type MistralResponseContent = {
    error: string;
    solution: string;
    example: string;
}
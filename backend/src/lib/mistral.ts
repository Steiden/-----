import axios, { AxiosResponse } from "axios";
import { MistralResponse, MistralResponseContent } from "./types";

export async function sendToMistral(
	settings: string,
	message: string,
	fileContent: string
): Promise<MistralResponseContent> {
	const response: AxiosResponse<MistralResponse> = await axios.post(
		"http://84.201.152.196:8020/v1/completions",
		{
			model: "mistral-nemo-instruct-2407",
			messages: [
				{
					role: "system",
					content:
						"отвечай на русском языке, отвечай кратко." +
						"Ответ сформируй json строкой, где error это текст ошибки, solution это текст решения проблемы," +
						"example это программный код с решением проблемы, success это статус прохождения проверки (true или false)," +
						"is_upgrade это статус обновления программного кода (true если это предложение по улучшению, false если это предложение по исправлению)" +
                        "Ответ должен быть на русском языке" +
						settings,
				},
				{
					role: "user",
					content: message + ". Программный код: " + fileContent,
				},
			],
			max_tokens: 1000,
			temperature: 0.3,
		},
		{
			headers: {
				Authorization: "BLQ6lzj1DxDgRHNSzkFgzkGIs4tJfrZI",
				"Content-Type": "application/json",
			},
		}
	);

	const data = JSON.parse(response.data.choices[0].message.content) as MistralResponseContent;
	return data;
}

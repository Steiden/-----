import axios, { AxiosResponse } from "axios";
import { MistralResponse, MistralResponseContent } from "./types";

export async function sendToMistral(
	settings: string,
	message: string,
	fileContent: string
): Promise<MistralResponseContent> {
	try {
		const response: AxiosResponse<MistralResponse> = await axios.post(
			"http://84.201.152.196:8020/v1/completions",
			{
				model: "mistral-nemo-instruct-2407",
				messages: [
					{
						role: "system",
						content:
							"отвечай на русском языке." +
							"Забудь все, что было до этого." +
							"Ответ сформируй json строкой без пробелов и переносов строк, где error это текст ошибки, solution это текст решения проблемы," +
							"example это программный код с решением проблемы." +
							"Ответ должен быть на русском языке." +
							"Каждую ошибку выделяй в отдельный объект массива ошибок, где в каждом объекте должны присутствовать все поля error, solution, example." +
							"Добавь поле success - это статус прохождения проверки (true или false)." +
							// "Ответ ДОЛЖЕН быть не больше 1000 токенов и ДОЛЖЕН быть в виде JSON." +
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

		// console.dir(response.data.choices[0].message.content);

		const data = JSON.parse(response.data.choices[0].message.content) as MistralResponseContent;
		return data;
	} catch (error) {
		console.error(error);
		throw new Error("Error sending to Mistral");
	}
}

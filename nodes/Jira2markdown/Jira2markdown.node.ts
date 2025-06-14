import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { to_markdown, to_jira } from 'jira2md';

export class Jira2markdown implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Jira2Markdown Node',
		name: 'jira2markdown',
		group: ['transform'],
		icon: 'file:jira2markdown.svg',
		version: 1,
		description: 'Transforms Jira markdown into normal markdown',
		defaults: {
			name: 'jira2markdown',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			// --- Selector del Tipo de Conversión ---
			{
				displayName: 'Conversion Type',
				name: 'conversionType',
				type: 'options',
				default: 'jiraToMarkdown',
				options: [
					{
						name: 'From Jira to Markdown',
						value: 'jiraToMarkdown',
						description: 'Converts Jira Wiki Markup to standard Markdown',
					},
					{
						name: 'From Markdown to Jira',
						value: 'markdownToJira',
						description: 'Converts standard Markdown to Jira Wiki Markup',
					},
				],
				description: 'Select the desired conversion direction',
			},
			{
				displayName: 'Input Text',
				name: 'inputText',
				type: 'string',
				default: '',
				typeOptions: {
					rows: 8,
				},
				placeholder: 'Enter text to convert...',
				description: 'The text to be converted based on the selected conversion type',
			},
			{
				displayName: 'Destination Key',
				name: 'destinationKey',
				type: 'string',
				default: 'markdown',
				placeholder: 'markdown',
				description:
					'The name of the key to which the converted text will be assigned in the output JSON',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const conversionType = this.getNodeParameter(
				'conversionType',
				itemIndex,
				'jiraToMarkdown',
			) as string;
			const inputText = this.getNodeParameter('inputText', itemIndex, '') as string;
			const destinationKey = this.getNodeParameter(
				'destinationKey',
				itemIndex,
				'markdown',
			) as string;
			const item = items[itemIndex];

			item.json[destinationKey] =
				conversionType === 'jiraToMarkdown' ? to_markdown(inputText) : to_jira(inputText);
		}

		return this.prepareOutputData(items);
	}
}

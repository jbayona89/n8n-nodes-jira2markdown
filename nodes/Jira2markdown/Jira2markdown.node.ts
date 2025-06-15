import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { to_markdown, to_jira, jira_to_html, md_to_html } from 'jira2md';

type Conversion = 'jiraToMarkdown' | 'markdownToJira' | 'jiraToHtml' | 'markdownToHtml';

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
					{
						name: 'From Jira to HTML',
						value: 'jiraToHtml',
						description: 'Converts Jira Wiki Markup to HTML',
					},
					{
						name: 'From Markdown to HTML',
						value: 'markdownToHtml',
						description: 'Converts standard markdown to HTML',
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
		const conversions: Record<Conversion, (text: string) => string> = {
			jiraToMarkdown: to_markdown,
			markdownToJira: to_jira,
			jiraToHtml: jira_to_html,
			markdownToHtml: md_to_html,
		};

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			const conversionType = this.getNodeParameter(
				'conversionType',
				itemIndex,
				'jiraToMarkdown',
			) as Conversion;
			const inputText = this.getNodeParameter('inputText', itemIndex, '') as string;
			const destinationKey = this.getNodeParameter(
				'destinationKey',
				itemIndex,
				'markdown',
			) as string;
			const item = items[itemIndex];

			item.json[destinationKey] = conversions[conversionType](
				inputText.replaceAll('|smart-link', '').replaceAll('|smart-card', ''),
			);
		}

		return this.prepareOutputData(items);
	}
}

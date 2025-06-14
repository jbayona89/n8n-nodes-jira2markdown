declare module 'jira2md' {
	export const to_markdown = (jira_md: string) => string;
	export const to_jira = (markdown: string) => string;
}

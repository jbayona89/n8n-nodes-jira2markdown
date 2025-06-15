declare module 'jira2md' {
	export const md_to_html = (markdown: string) => string;
	export const jira_to_html = (jira_md: string) => string;
	export const to_markdown = (jira_md: string) => string;
	export const to_jira = (markdown: string) => string;
}

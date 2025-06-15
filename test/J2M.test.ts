const assert = require('assert');
import { J2M } from '../nodes/Jira2markdown/J2M';

describe('J2M', () => {
	it('Jira to markdown should return proper markdown', function () {
		const input = `
This is a normal line.

This is *bold text* and this is *another bold text*.

This is _italic text_ and this is _another italic text_.

This line has *_bold and italic_*.

* List 1
* List 2
** List 2.1
* List 3
`;
		const expectedOutput = `
This is a normal line.

This is **bold text** and this is **another bold text**.

This is *italic text* and this is *another italic text*.

This line has ***bold and italic***.

* List 1
* List 2
  * List 2.1
* List 3
`;
		assert.strictEqual(J2M.to_markdown(input), expectedOutput);
	});
});

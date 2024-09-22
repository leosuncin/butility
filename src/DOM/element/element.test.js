import { expect } from '@open-wc/testing';

import { Element } from './element';

describe('Element', () => {
    describe('create', () => {
        it('throws an error if no element name is provided', () => {
            const message = "Element creation requires a 'name' property.";

            expect(() => Element.create()).to.throw(message);
            expect(() => Element.create(null)).to.throw(message);
        });

        it('creates an element with the provided name', () => {
            const name = 'input';
            const element = Element.create({
                name,
            });

            expect(element).to.be.an.instanceOf(HTMLElement);
            expect(element).to.have.tagName(name);
        });

        it('creates an element with the provided CSS classes', () => {
            const classes = ['class1', 'class2'];
            const element = Element.create({
                name: 'input',
                class: classes,
            });

            expect(element).to.have.class(classes[0]);
            expect(element).to.have.class(classes[1]);
            expect(element.classList).to.have.lengthOf(classes.length);
        });

        it('creates an element with the provided attributes', () => {
            const attributes = {
                type: 'text',
                placeholder: 'Enter text here',
            };
            const element = Element.create({
                name: 'input',
                attr: attributes,
            });

            expect(element).to.have.attribute('type', attributes.type);
            expect(element).to.have.attribute(
                'placeholder',
                attributes.placeholder,
            );
        });

        it('creates an element with the provided text content', () => {
            const text = 'Hello, World!';
            const element = Element.create({
                name: 'label',
                innerText: text,
            });

            expect(element).to.have.text(text);
        });

        it('creates an element with the provided HTML content', () => {
            const html = '<strong>Hello, World!</strong>';
            const element = Element.create({
                name: 'div',
                innerHTML: html,
            });

            expect(element).to.have.html(html);
        });

        it('creates an element with children elements', () => {
            const children = [
                Element.create({ name: 'span', innerText: 'Child 1' }),
                Element.create({ name: 'span', innerText: 'Child 2' }),
            ];
            const element = Element.create({
                name: 'div',
                children,
            });

            expect(element.children).to.have.lengthOf(children.length);
            expect(element.children[0]).to.have.text('Child 1');
            expect(element.children[1]).to.have.text('Child 2');
        });

        it('creates a draggable element', () => {
            const element = Element.create({
                name: 'div',
                draggable: true,
            });

            expect(element).to.have.attribute('draggable');
        });

        it('creates an element with CSS style', async () => {
            const element = Element.create(
                {
                    name: 'button',
                    innerText: 'Hello',
                    style: 'color: white; display: block',
                },
                (element) => document.body.appendChild(element),
            );

            expect(element).to.have.style('color', 'rgb(255, 255, 255)');
            expect(element).to.have.style('display', 'block');
        });
    });

    describe('setHTML', () => {
        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('replaces the HTML content of an element', () => {
            const html = '<strong>Hello, World!</strong>';

            Element.setHTML(document.body, html);

            expect(document.body).to.have.html(html);
        });

        it('evaluates the scripts from the new HTML content', () => {
            const html = `<div>
                <label id="testLabel">Test</label>
            </div>
            <script type="module">
                document.querySelector('#testLabel').innerText = 'Hello, World!';
            </script>`;

            Element.setHTML(document.body, html, true);

            expect(document.querySelector('#testLabel')).to.exist;
            expect(document.querySelector('#testLabel')).to.have.text(
                'Hello, World!',
            );
        });
    });

    describe('getHTML', () => {
        it('returns the safe  HTML content of an element', () => {
            Element.setHTML(
                document.body,
                `<div data-test="get-html">
<label id="testLabel">Element.getHTML</label>
</div>
<iframe src="https://google.com" frameborder="5"></iframe>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>`,
                true,
            );

            const htmlContent = Element.getHTML(document.body);

            expect(document.querySelector('iframe,link,script')).to.exist;
            expect(htmlContent).not.to.match(/<iframe|<link|<script/);
            expect(htmlContent.trimEnd()).to.be
                .equal(`<div data-test="get-html">
<label id="testLabel">Element.getHTML</label>
</div>`);
        });
    });

    describe('setText', () => {
        it('sets the text content of an element', () => {
            const text = 'Hello, World!';
            const element = Element.create({ name: 'label' });

            Element.setText(element, text);

            expect(element).to.have.text(text);
        });

        it('sets the text content and transform it to upper case', () => {
            const text = 'Hello, World!';
            const element = Element.create({ name: 'label' });

            Element.setText(element, text, { toUpperCase: true });

            expect(element).to.have.text('HELLO, WORLD!');
        });

        it('sets the text content and transform it to lower case', () => {
            const text = 'Hello, World!';
            const element = Element.create({ name: 'label' });

            Element.setText(element, text, { toLowerCase: true });

            expect(element).to.have.text('hello, world!');
        });
    });

    describe('appendElement', () => {
        it('appends a child element to another element', () => {
            const parent = Element.create({ name: 'div' });
            const child = Element.create({ name: 'span' });

            Element.appendElement(parent, child);

            expect(parent.children).to.have.lengthOf(1);
            expect(parent.children[0]).to.have.tagName('span');
        });

        it('appends multiple child elements to another element', () => {
            const parentElement = Element.create({ name: 'ul' });
            const childElement = Element.create({
                name: 'ol',
                children: [
                    Element.create({ name: 'li', innerText: 'Child 1' }),
                    Element.create({ name: 'li', innerText: 'Child 2' }),
                ],
            });

            Element.appendElement(parentElement, childElement, true);

            expect(parentElement.children).to.have.lengthOf(
                childElement.children.length,
            );
            expect(parentElement.children[0]).to.have.tagName('li');
            expect(parentElement.children[1]).to.have.tagName('li');
        });
    });

    describe('appendElements', () => {
        it('appends multiple child elements to another element', () => {
            const parentElement = Element.create({ name: 'ul' });
            const child1 = Element.create({ name: 'li', innerText: 'Child 1' });
            const child2 = Element.create({ name: 'li', innerText: 'Child 2' });

            Element.appendElements(parentElement, child1, child2);

            expect(parentElement.children).to.have.lengthOf(2);
            expect(parentElement.children[0]).to.have.text('Child 1');
            expect(parentElement.children[1]).to.have.text('Child 2');
        });
    });

    describe('cloneElementWithClasses', () => {
        it('clones an element with its CSS classes', () => {
            const sourceElement = Element.create({
                name: 'div',
                class: ['class1', 'class2'],
            });
            const targetElement = Element.create({ name: 'div' });

            Element.cloneElementWithClasses(sourceElement, targetElement);

            expect(targetElement.firstChild).to.have.class('class1');
            expect(targetElement.firstChild).to.have.class('class2');
        });
    });
});

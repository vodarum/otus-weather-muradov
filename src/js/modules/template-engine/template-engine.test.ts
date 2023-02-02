import TemplateEngine from "./template-engine";

const mockData = [
  {
    title: "List № 1",
    author: "Sam",
    tags: [
      {
        id: 1,
        title: "One",
      },
      {
        id: 2,
        title: "Two",
      },
      {
        id: 3,
        title: "Three",
      },
    ],
  },
  {
    title: "List № 2",
    tags: [
      {
        id: 1,
        title: "One",
      },
      {
        id: 2,
        title: "Two",
      },
      {
        id: 3,
        title: "Three",
      },
    ],
    buttons: [
      {
        type: "submit",
        text: "Send",
      },
      {
        type: "button",
        text: "Click",
      },
      {
        type: "reset",
        text: "Clear",
      },
    ],
  },
];

const toSingleLine = (multilineString: string) =>
  multilineString
    .split("\n")
    .reduce((accumulator, line) => accumulator + line.trim(), "");

describe("TemplateEngine", () => {
  it.each(mockData)("parse variables", (mockObject) => {
    expect(TemplateEngine.render("<h2>{{title}}</h2>", mockObject)).toBe(
      `<h2>${mockObject.title}</h2>`
    );
  });

  it.each(mockData)("parse conditions and variables", (mockObject) => {
    expect(
      TemplateEngine.render(
        "{{if author}}<h3>{{author}}</h3>{{endif}}",
        mockObject
      )
    ).toBe(mockObject.author ? `<h3>${mockObject.author}</h3>` : "");
  });

  it.each(mockData)("parse loops, conditions and variables", (mockObject) => {
    let result = `<div class="tags">`;

    result += `${mockObject.tags.reduce(
      (accumulator, currentValue, index, array) => {
        let tag = `<a class="tag" href="#tag${currentValue.id}">${currentValue.title}</a>`;

        tag += index !== array.length - 1 ? ", " : "";

        return accumulator + tag;
      },
      ""
    )}</div>`;

    if (mockObject.buttons) {
      result += mockObject.buttons.reduce((accumulator, btn, idx, array) => {
        let str = `${accumulator}<button type="${btn.type}" class="btn`;

        if (idx === 0) {
          str += " btn-success";
        } else if (idx === array.length - 1) {
          str += " btn-danger";
        }

        str += `">${btn.text}</button>${
          idx === array.length - 1 ? "</div>" : ""
        }`;

        return str;
      }, `<div class="buttons">`);
    }

    expect(
      TemplateEngine.render(
        toSingleLine(
          `<div class="tags">
             {{for tags as item}}
             <a class="tag" href="#tag{{item.id}}">{{item.title}}</a>
             {{if notIsLast}}, {{endif}}
             {{endfor}}
           </div>
           {{if buttons}}
             <div class="buttons">
               {{for buttons as btn}}
                 <button type="{{btn.type}}" class="btn{{if isFirst}} btn-success{{endif}}{{if isLast}} btn-danger{{endif}}">{{btn.text}}</button>
               {{endfor}}
             </div>
           {{endif}}`
        ),
        mockObject
      )
    ).toBe(toSingleLine(result));
  });

  it.each(mockData)("parse template and correct render", (mockObject) => {
    expect(
      TemplateEngine.render(
        toSingleLine(
          `<h2>{{title}}</h2>
            {{if author}}
              <h3>{{author}}</h3>
            {{endif}}
            <div class="tags">
              {{for tags as item}}
              <a class="tag" href="#tag{{item.id}}">{{item.title}}</a>
              {{if notIsLast}}, {{endif}}
              {{endfor}}
            </div>`
        ),
        mockObject
      )
    ).toBe(
      toSingleLine(`<h2>${mockObject.title}</h2>
              ${mockObject.author ? `<h3>${mockObject.author}</h3>` : ""}
            <div class="tags">
            ${mockObject.tags.reduce((accumulator, currentValue, index) => {
              let tag = `<a class="tag" href="#tag${currentValue.id}">${currentValue.title}</a>`;

              tag += index !== mockObject.tags.length - 1 ? ", " : "";

              return accumulator + tag;
            }, "")}
            </div>`)
    );
  });
});

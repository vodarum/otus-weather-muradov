class TemplateEngine {
  render(source: string, data: { [key: string]: any }): string {
    // source = source
    //   .split("\n")
    //   .reduce((accumulator, line) => accumulator + line.trim(), "");
    source = this.replaceLoop(source, data);
    source = this.replaceCondition(source, data);
    source = this.replaceVariable(source, data);
    source = source.replace(/\s+(?=[.,?!:;])/, ""); // ???

    return source;
  }

  /* eslint class-methods-use-this: ["error", { "exceptMethods": ["replaceVariable"] }] */
  private replaceVariable(
    source: string,
    data: { [key: string]: any }
  ): string {
    return source.replace(/{{(.[^}}]+)}}/gm, (match, variableName) => {
      if (/\./gm.test(variableName)) {
        return variableName
          .split(".")
          .reduce(
            (accumulator: { [key: string]: any }, propertyName: string) =>
              accumulator[propertyName] || accumulator,
            data
          );
      }

      return data[variableName] || "";
    });
  }

  private replaceCondition(
    source: string,
    data: { [key: string]: any }
  ): string {
    return source.replace(
      // {{if (.+?)}}(.+?){{endif}}
      /{{if (\w+)}}(.*?){{endif}}/gms,
      (match: string, condition: string, action: string) => {
        if (
          ((condition === "isFirst" ||
            condition === "isLast" ||
            condition === "notIsFirst" ||
            condition === "notIsLast") &&
            data.index[condition]) ||
          data[condition]
        ) {
          return this.render(action, data);
        }

        return "";
      }
    );
  }

  private replaceLoop(source: string, data: { [key: string]: any }): string {
    return source.replace(
      /{{for (\w+) as (\w+)}}(.+?){{endfor}}/gms,
      (
        match: string,
        collectionName: string,
        collectionItemName: string,
        repeatedSource: string
      ) =>
        (data[collectionName] || []).reduce(
          (
            accumulator: string,
            item: { [key: string]: any },
            index: number,
            array: Array<{ [key: string]: any }>
          ) => {
            const itemData: { [key: string]: any } = {
              index: {
                value: index,
                isFirst: index === 0,
                isLast: index === array.length - 1,
                notIsFirst: index !== 0,
                notIsLast: index !== array.length - 1,
              },
            };

            itemData[collectionItemName] = item;

            return accumulator + this.render(repeatedSource, itemData);
          },
          ""
        )
    );
  }
}

export default new TemplateEngine();

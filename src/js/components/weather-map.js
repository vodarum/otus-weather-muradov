import Component from "../modules/Component/Component";
import TemplateEngine from "../modules/template-engine/template-engine";

export default class WeatherMapComponent extends Component {
  render() {
    if (JSON.stringify(this.state) === "{}") {
      return super.render();
    }

    return TemplateEngine.render(
      `<img src="https://static-maps.yandex.ru/1.x/?ll={{longitude}},{{latitude}}&size=650,350&z=12&l=map">`,
      this.state
    );
  }
}

import Component from "../modules/Component/Component";
import TemplateEngine from "../modules/template-engine/template-engine";

export default class WeatherHistoryComponent extends Component {
  render() {
    if (JSON.stringify(this.state) === "{}") {
      return super.render();
    }

    return TemplateEngine.render(
      `{{for weatherHistory as item}}
        <span class="weather-history__item" data-wh-item-id="{{index.value}}">{{item.city}}</span>
      {{endfor}}`,
      this.state
    );
  }
}

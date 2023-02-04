import Component from "../modules/Component/Component";
import TemplateEngine from "../modules/template-engine/template-engine";

export default class WeatherMainComponent extends Component {
  render() {
    if (JSON.stringify(this.state) === "{}") {
      return super.render();
    }

    return TemplateEngine.render(
      `{{if icon}}<img src="http://openweathermap.org/img/w/{{icon}}.png" class="weather-main__img">{{endif}}
      <div class="weather-main__text">
        {{if city}}<p>Город: {{city}}</p>{{endif}}
        {{if temp}}<p>Температура: {{temp}}&#176;С</p>{{endif}}
      </div>`,
      this.state
    );
  }
}

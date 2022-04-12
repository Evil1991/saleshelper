import './App.css';
import React from 'react';
import Form from './Form.js';
import 'bootstrap/dist/css/bootstrap.css';
import {Building, People} from 'react-bootstrap-icons';

function App() {
  return (
    <div className="App">
        <div className="container">
            <div className="find-company find-block">
                <div className="row"><Building className="left-icon" size={32}/><h1>Найти человека по компании</h1></div>
                <DomainForm name="домену компании" error="Введите корректный домен" blockClass="domain"/>
                <INNForm name="ИНН или ОГРН" error="Введите корректный ИНН или ОГРН" blockClass="inn"/>
                <CompanyNameForm name="названию" error="Введите корректное название" blockClass="company-name"/>
            </div>
        </div>
        <br />
        <div className="container">
            <div className="find-people find-block">
                <div className="row"><People className="left-icon" size={32}/><h1>Найти контакты человека</h1></div>
                <GuyForm name="Имя Фамилия" error="Введите имя и фамилию, либо фамилию" blockClass="guy"/>
                <EmailForm name="Email" error="Введите email" blockClass="email"/>
                <PhoneForm name="телефону вида 79990000000" error="Введите телефон вида 79990000000" blockClass="phone"/>
                <NickForm name="нику или ссылке на соц сети" error="Введите ник или ссылку на соц-сети" blockClass="nick"/>
            </div>
        </div>
    </div>
  );
}



function getDomainInfo(domain){
    var data = new FormData();
    data.append('domain', domain);
    fetch('https://admin.leadget.ru/sales/getDomain.php', {
        method: 'POST',
        body: data
    }).then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    titleWords: result.titleWords,
                    titleNewWords: result.titleNewWords,
                    descWords: result.descWords,
                    descNewWords: result.descNewWords,
                    descFinish: result.descFinish,
                    pageData: result.pageData
                });
                console.log(result);
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        )
}

class INNForm extends Form{
    constructor(props) {
        super(props); // вызов родительского конструктора
        this.links = [
            {name: 'list-org.ru', linkMask:'https://www.list-org.com/search?val=#LINK#&type=all'},
            {name: 'google.com', linkMask:'https://www.google.com/search?q=#LINK#'},
        ];

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    validate(str){
        if(typeof str !== 'string' ||
            (str.length !== 10 && str.length !== 12 && str.length !== 13 && str.length !== 15) ||
            str.split('').some((symbol) => isNaN(Number(symbol)))
        ) return false;

        return str;
    }
}
class DomainForm extends Form{
    constructor(props) {
        super(props); // вызов родительского конструктора
        this.links = [
            {name: 'snov.io', linkMask:'https://app.snov.io/domain-search?name=#LINK#&tab=personal'},
            {name: 'duckduckgo', linkMask:'https://duckduckgo.com/?q=%22%40#LINK#%22&t=h_&ia=web'},
        ];

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    validate(str){
        const match = str.match(/^(?:https?:)?(?:\/\/)?([^\/\?]+\.+[^\/\?]+)/i);
        return match && match[1];
    }
}

class CompanyNameForm extends Form{
    constructor(props) {
        super(props); // вызов родительского конструктора
        this.links = [
            {name: 'facebook поиск(пробуйте еще указать людей с местом работы)', linkMask:'https://www.facebook.com/search/top?q=#LINK#'},
            {name: 'TAdviser', linkMask:'https://www.tadviser.ru/index.php?action=ajax&rs=wfAjaxSearchSuggest&rsargs[]=#LINK#'},
            {name: 'Cnews публикации', linkMask:'https://www.cnews.ru/search?search=#LINK#'},
            {name: 'google.com на tagline.ru', linkMask:'https://www.google.com/search?q=#LINK#'+encodeURIComponent(' site:tagline.ru')},
            {name: 'google.com директор', linkMask:'https://www.google.com/search?q=#LINK#'+encodeURIComponent(' директор')},
            {name: 'google.com CPO', linkMask:'https://www.google.com/search?q=#LINK#'+encodeURIComponent(' CPO')},
            {name: 'google.com team lead', linkMask:'https://www.google.com/search?q=#LINK#'+encodeURIComponent(' team lead')},
            {name: 'google.com ИТ-директор', linkMask:'https://www.google.com/search?q=#LINK#'+encodeURIComponent(' ит директор')},
            {name: 'google.com hh.ru', linkMask:'https://www.google.com/search?q=#LINK#'+encodeURIComponent(' site:hh.ru')},
            {name: 'vk.com', linkMask:'https://vk.com/search?c%5Bcompany%5D=#LINK#&c%5Bname%5D=1&c%5Bper_page%5D=40&c%5Bsection%5D=people'},
            {name: 'linkedin.com', linkMask:'https://www.linkedin.com/search/results/companies/?keywords=#LINK#&origin=SWITCH_SEARCH_VERTICAL&sid=yfk'},
        ];

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    validate(str){
        if(this.length === 0 || !str.trim()) return false;
        return str;
    }
}

class GuyForm extends Form{
    constructor(props) {
        super(props); // вызов родительского конструктора
        this.state = {
            formValue: '',
            formValue2: '', //Для профессии и т.п. вторых аргументов
            value: '',
            error: ''
        };
        this.links = [
            {name: 'facebook', linkMask:'https://www.facebook.com/search/top?q=#LINK#'},
            {name: 'vk.com', linkMask:'https://vk.com/search?c%5Bname%5D=1&c%5Bper_page%5D=40&c%5Bq%5D=#LINK#&c%5Bsection%5D=people'},
            {name: 'linkedin.com', linkMask:'https://www.linkedin.com/search/results/people/?keywords=#LINK#&origin=SWITCH_SEARCH_VERTICAL&sid=yfk'},
            {name: 'instagram.com(ссылка общая)', linkMask:'https://www.instagram.com/explore/search/'},
            {name: 'google.com', linkMask:'https://www.google.com/search?q=#LINK#'},
        ];

        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({formValue: event.target.value});
        if(!this.validate(event.target.value))
            this.setState({error: this.props.error});
        else {
            this.setState({error: ''});
        }
        this.state.value = this.validate(event.target.value) + (this.state.formValue2 ? ' ' + this.state.formValue2 : '');
    }

    handleChange2(event) {
        this.setState({formValue2: event.target.value});
        this.state.value = this.state.formValue + (this.state.formValue2 ? ' ' + event.target.value : '');
    }

    validate(str){
        if(this.length === 0 || !str.trim()) return false;
        return str;
    }
    renderForm(){
        return(
            <form className="input-form" onSubmit={this.handleSubmit}>
                <label>
                    <input placeholder="Введите имя фамилию" name="formValue" type="text" value={this.state.formValue} onChange={this.handleChange} />
                    <input placeholder="Введите профессию" name="formValue2" class="formValue2" type="text" value={this.state.formValue2} onChange={this.handleChange2} />
                </label>
            </form>
        )
    }
}

class EmailForm extends Form{
    constructor(props) {
        super(props); // вызов родительского конструктора
        this.links = [
            {name: 'yandex.ru', linkMask:'https://yandex.ru/search/?lr=1&text=#LINK#'},
            {name: 'google.com', linkMask:'https://www.google.com/search?q=#LINK#'},
        ];
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    validate(str){
        if(this.length === 0 || !str.trim()) return false;
        return str;
    }
}

class PhoneForm extends Form{
    constructor(props) {
        super(props); // вызов родительского конструктора
        this.links = [
            {name: 'yandex.ru', linkMask:'https://yandex.ru/search/?lr=1&text=#LINK#'},
            {name: 'google.com', linkMask:'https://www.google.com/search?q=#LINK#'},
            {name: 'whatsapp, используйте для фото и фио', linkMask:'https://wa.me/#LINK#'},
            {name: 'telegram', linkMask:'https://t.me/+#LINK#'},
        ];
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    validate(str){
        if(this.length === 0 || !str.trim()) return false;
        str = str.replaceAll(' ', '');
        return str.match(/^\d{11}/i);
    }
}

class NickForm extends Form{
    constructor(props) {
        super(props); // вызов родительского конструктора
        this.links = [
            {name: 'facebook', linkMask:'https://facebook.com/#LINK#'},
            {name: 'google.com', linkMask:'https://www.google.com/search?q=#LINK#'},
            {name: 'instagram.com', linkMask:'https://instagram.com/#LINK#'},
            {name: 'vk.com', linkMask:'https://vk.com/#LINK#'},
            {name: 'linkedin.com', linkMask:'https://www.linkedin.com/in/#LINK#'},
            {name: 'telegram', linkMask:'https://t.me/#LINK_WITHOUT_DOT#'},
            {name: 'хабр карьера', linkMask:'https://career.habr.com/#LINK#'},
        ];
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    validate(str){
        if(this.length === 0 || !str.trim()) return false;
        const match = str.match(/\/?([^/]+)$/i);
        return match[1];
    }
}

export default App;

/**
 * @TODO
 * 1. Добавить к домену парсинг: телефон, емайл, группы в соц сетях
 * 2. По повторению паттерна в тайтле пробовать выявлять название
 * 3. Отдельно вычислять ссылку на контакты и там тоже смотреть инфу
 * 4. По никам смотреть ответ сервера, там где 404 подсвечивать красным
 * 5. Добавить подсказку, как работать с каждым пунктом
 */
import './App.css';
import React, {useState, useRef, useEffect} from 'react';
import Form from './Form.js';
import 'bootstrap/dist/css/bootstrap.css';
import {Building, People} from 'react-bootstrap-icons';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import translateDictionary from './dictionary.js';
import CompanyUniversalForm from './CompanyUniversalForm.js';
import Context from './Context';

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

const texts = {
    'subject' : 'По поводу вакансии react-специалиста в аустафф',
    'bodyMail' : 'Здравствуйте, #GUY#, увидел у вас вакансию react-специалиста в #COMPANYNAME#. Мы компания, предоставляющая специалистов в аутстаф. Рассмотрите такой вариант? Можем отправить вам CV и рейт специалиста. ',
    'bodyMessenger' : '#GUY#, здравствуйте, обратил внимание, что #COMPANYNAME# активно нанимает react-специалистов, у нас как раз есть свободный в аутстафф, подскажите, с кем можно связаться по этому вопросу?',
}



function App() {
    const cyrillicToTranslit = new CyrillicToTranslit();

    const [vars, setVars] = useState({});
    const [email, setEmail] = useState('');
    const [guy, setGuy] = useState('');
    const [data, setData] = useState({});
    const [message, setMessage] = useState('Добавьте имя и компанию');
    const [copyState, setCopyState] = useState('');

    const textAreaRef = useRef(null);

    const getValue = (name, val) => {
        vars[name] = val.trim();
        setVars(vars);
        if(vars.email !== undefined){
            setEmail(vars.email);
        }
        if(vars.guy !== undefined) {
            let guyName = vars.guy.trim();
            guyName = guyName.split(' ');
            guyName = guyName[0];

            if (translateDictionary[guyName.toLowerCase()] !== undefined)
                guyName = translateDictionary[guyName.toLowerCase()];
            else
                guyName = cyrillicToTranslit.reverse(guyName);

            guyName = guyName.capitalize();
            setGuy(guyName);
            setMessage(texts.bodyMessenger.replaceAll('#GUY#', guyName).replaceAll('#COMPANYNAME#', vars.companyName));
        }

    }

    const getValueObject = (obj) => {
        setData({...obj});
    }

    const copyToClipboard = (e) => {
        textAreaRef.current.select();
        document.execCommand('copy');
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        e.target.focus();
        setCopyState('Скопировано!');
        setTimeout(() => setCopyState(''), 3000);
    };


  return (
      <Context.Provider value={{getValue, getValueObject}}>
        <div className="App">
            <div className="container">
                <div className="row">
                    <div className="find-universal-company find-block">
                        <div className="row"><Building className="left-icon" size={32}/><h1>Поиск информации о компании</h1></div>
                        <CompanyUniversalForm var="companyUniversal" name="домену, названию, ИНН или ОРГН компании" error="Не распознаны данные" />
                    </div>
                </div>
            </div>
            <NewTable {...data} />
            <br />
            <div className="container">
                <div className="row">
                    <div className="find-company find-block">
                        <div className="row"><Building className="left-icon" size={32}/><h1>Найти человека по компании</h1></div>
                        <DomainForm var="domain" name="домену компании" error="Введите корректный домен"/>
                        <INNForm var="INN" name="ИНН или ОГРН" error="Введите корректный ИНН или ОГРН" />
                        <CompanyNameForm var="companyName" name="названию" error="Введите корректное название"/>
                    </div>
                </div>
            </div>
            <br />
            <div className="container">
                <div className="row">
                    <div className="find-people find-block col-md-7">
                        <div className="row"><People className="left-icon" size={32}/><h1>Найти контакты человека</h1></div>
                        <GuyForm var="guy" name="Имя Фамилия" error="Введите имя и фамилию, либо фамилию"/>
                        <EmailForm var="email" name="Email" error="Введите email"/>
                        <PhoneForm var="phone" name="телефону вида 79990000000" error="Введите телефон вида 79990000000"/>
                        <NickForm var="nick" name="нику или ссылке на соц сети" error="Введите ник или ссылку на соц-сети"/>
                        <GitHubForm var="github" name="ссылке на коммит в гитхабе" error="Введите ссылку на коммит"/>
                    </div>
                    <div className="message col-md-5">
                        <div className="fixed-block">
                            <textarea ref={textAreaRef} onClick={copyToClipboard} name="" id="" cols="30" rows="10" value={message} />
                            {copyState ? <div className="alert alert-success">{copyState}</div> : ''}
                            <SendEmail email={email} guy={guy} companyName={vars.companyName} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Context.Provider>
  );
}
//
function NewTable(props){
    return <div className="data-table">
        <table>
            <thead>
            <tr>
                <th>Компания</th>
                <th>Адрес сайта</th>
                <th>ИНН или ОГРН</th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{props.companyName}</td>
                <td>{props.domain}</td>
                <td>{props.INN}</td>
                <td></td>
                <td></td>
            </tr>
            </tbody>
        </table>
    </div>
}


function SendEmail(props){
    const [elink, setElink] = useState('mailto:' + props.email);

    useEffect(() => {
        let newText = texts.bodyMail.replaceAll('#GUY#', props.guy).replaceAll('#COMPANYNAME#', props.companyName);
        setElink('mailto:' + props.email + '?subject='+encodeURIComponent(texts.subject)+'&body='+encodeURIComponent(newText));
    });

    return (
        <div className="emailSend">
            {props.email ? <a href={elink} target="_blank" className='sendEmail'>Написать</a> : <div className='alert alert-info'>Укажите email, чтобы написать</div>}
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
            {name: 'Чат управление агентством (общая ссылка)', linkMask:'https://t.me/agencyboss'},
        ];

        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.context.getValue(this.props.var, event.target.value);
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
            <form className="input-form">
                <label>
                    <input placeholder="Введите имя фамилию" name="formValue" type="text" value={this.state.formValue} onChange={this.handleChange} />
                    <input placeholder="Введите профессию" name="formValue2" className="formValue2" type="text" value={this.state.formValue2} onChange={this.handleChange2} />
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
        str = str.replaceAll(' ', '')
            .replaceAll('+', '')
            .replaceAll('(', '')
            .replaceAll(')', '')
            .replaceAll('-', '');
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
            {name: 'mail.ru', linkMask:'https://my.mail.ru/mail/nick/#LINK#/'},
            {name: 'twitter.com', linkMask:'https://twiiter.com/#LINK#'},
            {name: 'github.com', linkMask:'https://github.com/#LINK#'},
            {name: 'bitbucket.com', linkMask:'https://bitbucket.org/#LINK#'},
            {name: 'livejournal.ru', linkMask:'https://#LINK#.livejournal.com/'},
            {name: 'tinder', linkMask:'https://tinder.com/@#LINK#'},
            {name: 'tripadvisor', linkMask:'https://www.tripadvisor.com/Profile/#LINK#'},
            {name: 'Яднекс.Музыка', linkMask:'https://music.yandex.ru/users/#LINK#/playlists'},
            {name: 'Instagram(через другой сервис)', linkMask:'https://www.picuki.com/profile/#LINK#'},
            {name: 'Одноклассники', linkMask:'https://ok.ru/#LINK#'},
        ];
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    validate(str){
        if(this.length === 0 || !str.trim()) return false;
        const match = str.match(/\/?([^/]+)\/?$/i);
        return match[1];
    }
}

class GitHubForm extends Form{
    constructor(props) {
        super(props); // вызов родительского конструктора
        this.links = [
            {name: 'GitHub коммит', linkMask:'#DIRECTLINK#.patch'},
        ];
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    validate(str){
        return str;
    }
}



export default App;

import Form from "./Form";
import './App.css';
import React from 'react';
import Context from "./Context";


class CompanyUniversalForm extends Form{
    static contextType = Context;
    constructor(props) {
        super(props); // вызов родительского конструктора
        this.links = {};
        this.links.domain = [
            {name: 'snov.io', linkMask:'https://app.snov.io/domain-search?name=#LINK#&tab=personal'},
            {name: 'duckduckgo', linkMask:'https://duckduckgo.com/?q=%22%40#LINK#%22&t=h_&ia=web'},
        ];
        this.links.INN = [
            {name: 'list-org.ru', linkMask:'https://www.list-org.com/search?val=#LINK#&type=all'},
            {name: 'google.com', linkMask:'https://www.google.com/search?q=#LINK#'},
            {name: 'за честный бизнес', linkMask:'https://zachestnyibiznes.ru/search?query=#LINK#'},
        ];
        this.links.companyName = [
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
        this.type = 'companyName';
        this.state.data = {};
        this.typeLabel = {
            domain : 'адрес сайта',
            INN : 'ИНН или ОГРН',
            companyName : 'название компании'
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(event) {
        console.log(this.context)
        this.setState({formValue: event.target.value});
        if(!this.validate(event.target.value))
            this.setState({error: this.props.error});
        else {
            this.setState({error: ''});
            this.state.value = this.validate(event.target.value);
        }
        this.state.data[this.type] = this.state.value;
        this.context.getValueObject(this.state.data);
    }

    validate(str){
        const match = str.match(/^(?:https?:)?(?:\/\/)?([^\/\?]+\.+[^\/\?]+)/i);
        if(match){
            this.type = 'domain';
            return match[1];
        }

        if((str.length === 10 || str.length === 12 || str.length === 13 || str.length === 15) && !str.split('').some((symbol) => isNaN(Number(symbol))))
        {
            this.type = 'INN';
            return str;
        }

        if(str.length >= 3 && str.trim()){
            this.type = 'companyName';
            return str;
        }
        return false;
    }

    renderForm(){
        let label = 'Введите ';
        Object.keys(this.typeLabel).map((key, index) =>{
            if(index + 1 !== Object.keys(this.typeLabel).length) label+=this.typeLabel[key] + ', ';
            else  label+=this.typeLabel[key];
        });
        return(
            <form className="input-form" onSubmit={this.handleSubmit}>
                <label>
                    <input className="big-input" placeholder={label} name="formValue" type="text" value={this.state.formValue} onChange={this.handleChange} />
                </label>
            </form>
        )
    }

    getLinks(){
        this.state.links = [];
        this.links[this.type].map((link, index) => {
            let linkText = link.linkMask.replace('#LINK#', encodeURIComponent(this.state.value));
            linkText = linkText.replace('#DIRECTLINK#', this.state.value);
            linkText = linkText.replace('#LINK_WITHOUT_DOT#', encodeURIComponent(this.state.value.toString().replaceAll('.', '')));
            let obj = {name: link.name, link: linkText}
            this.state.links.push(obj);
        });
    }

    render() {
        this.getLinks();
        return (
            <div className={'block ' + this.props.blockClass}>
                {this.renderForm()}
                {this.state.value && !this.state.error ? (
                    <div className="row">
                        <ul className="item-list">
                            {this.state.links.map((link,index) =>
                                <li key={index}>{link.name}: <a target="_blank" href={link.link}>{link.link}</a></li>
                            )}
                        </ul>
                    </div>
                ) : ('')}
                {this.state.error ? (<div className="alert alert-danger">{this.state.error}</div> ):('')}
            </div>
        );
    }
}
export default CompanyUniversalForm;
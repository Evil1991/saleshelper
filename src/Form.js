import './App.css';
import React from 'react';

class Form extends React.Component {
    constructor(props) {
        super(props); // вызов родительского конструктора
        this.state = {
            formValue: '',
            value: '',
            error: ''
        };
        this.links = [
        ];

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validate(str){
        return false;
    }

    handleChange(event) {
        this.setState({formValue: event.target.value});
        if(!this.validate(event.target.value))
            this.setState({error: this.props.error});
        else {
            this.setState({error: ''});
            this.state.value = this.validate(event.target.value);
        }
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    renderForm(){
        return(
        <form className="input-form" onSubmit={this.handleSubmit}>
            <label>
                <input placeholder="Введите значение" name="formValue" type="text" value={this.state.formValue} onChange={this.handleChange} />
            </label>
        </form>
        )
    }

    getLinks(){
        this.state.links = [];
        this.links.map((link,index) => {
            let linkText = link.linkMask.replace('#LINK#', encodeURIComponent(this.state.value));
            linkText = linkText.replace('#LINK_WITHOUT_DOT#', encodeURIComponent(this.state.value.replaceAll('.','')));
            let obj = {name:link.name, link:linkText}
            this.state.links.push(obj);
        })
    }

    render() {
        this.getLinks();
        return (
            <div className={'block ' + this.props.blockClass}>
                <div className="row"><h2>Поиск по {this.props.name}</h2></div>
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

export default Form;
var prettyCron = require('prettycron');

import React from 'react';
import ReactDOM from 'react-dom';

class CronField extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.props.onChange(event.target.value);
    }
    render() {
        return (
            <div className="input-group">
                <span className="input-group-addon">{this.props.label}</span>
                <input type="text"
                        className="form-control"
                        value={this.props.value}
                        placeholder={this.props.placeholder}
                        onChange={this.handleChange} />
            </div>
        );
    }
}

class CronTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {activeTab: 'cron-minute'}
        this.updateTab = this.updateTab.bind(this)
    }
    updateTab(event) {
        document.getElementById(this.state.activeTab).className = '';
        document.getElementById(event.target.parentElement.id).className = "active";
        this.setState({activeTab: event.target.parentElement.id});
    }
    render() {
        let range = '0-60';
        if(this.state.activeTab === 'cron-minute') { range = '0-60'}
        else if(this.state.activeTab === 'cron-hour') { range = '0-23'}
        else if(this.state.activeTab === 'cron-day') { range = '1-31'}
        else if(this.state.activeTab === 'cron-month') { range = '1-12'}
        else if(this.state.activeTab === 'cron-weekday') { range = '0-6'}
        return (
            <div>
                <ul className="nav nav-tabs">
                    <li role="presentation" id="cron-minute" className="active"><a onClick={this.updateTab}>Minute</a></li>
                    <li role="presentation" id="cron-hour"><a onClick={this.updateTab}>Hour</a></li>
                    <li role="presentation" id="cron-day"><a onClick={this.updateTab}>Day</a></li>
                    <li role="presentation" id="cron-month"><a onClick={this.updateTab}>Month</a></li>
                    <li role="presentation" id="cron-weekday"><a onClick={this.updateTab}>Day of Week</a></li>
                </ul>
                <CronSyntax range={range} />
            </div>
        );
    }
}

class CronSyntax extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let range = '';
        if(this.props.range) {
            range = <li className="list-group-item">{this.props.range} - Acceptable Values</li>;
        }
        return (
            <div className="Syntax">
                <ul className="list-group">
                    <li className="list-group-item">* - The asterisk operator specifies all possible values for a field.</li>
                    <li className="list-group-item">, - This comma operator specifies a list of values. Ex: 1,3,6</li>
                    <li className="list-group-item">- - The dash operator specifies a range of values. Ex: "1-5"</li>
                    {range}
                </ul>
            </div>
        );
    }
}

class CronBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.handleCronChange = this.handleCronChange.bind(this);
        this.state = {cron: ''}
    }
    handleCronChange(cron) {
        this.setState({cron: cron});
    }
    render() {
        return(
            <div>
                <h2>The Current Cron Task Is: {this.state.cron}</h2>
                <h3>{prettyCron.toString(this.state.cron)}</h3>
                <h3>The next time this job will run is {prettyCron.getNext(this.state.cron)}</h3>
                <CronField
                    label="Cron"
                    placeholder="Cron String"
                    value={this.state.cron}
                    onChange={this.handleCronChange} />
                <CronTabs />
            </div>
        );
    }
}

ReactDOM.render(
     <CronBuilder />,
     document.getElementById('cron-builder')
);

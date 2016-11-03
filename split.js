var prettyCron = require('prettycron');

import React from 'react';
import ReactDOM from 'react-dom';

class CronField extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
    }
    handleChange(event) {
        this.props.onChange(this.props.label, event.target.value);
    }
    handleFocus() {
        this.props.onFocus(this.props.label);
    }
    render() {
        let valid = true;
        if(this.props.regex) {
            let reg = new RegExp(this.props.regex);
            valid = reg.test(this.props.value);
        };
        let formClass = "form-group";
        if(!valid) {
            formClass = "form-group has-error";
        };
        return (
            <form className={formClass}>
                <div className="input-group">
                    <span className="input-group-addon">{this.props.label}</span>
                    <input type="text"
                            className="form-control"
                            value={this.props.value}
                            placeholder={this.props.placeholder}
                            onChange={this.handleChange}
                            onFocus={this.handleFocus} />
                </div>
            </form>
        );
    }
}

class CronTabs extends React.Component {
    constructor(props) {
        super(props);
        this.updateTab = this.updateTab.bind(this);
    }
    updateTab(event) {
        this.props.onClick(event.target.parentElement.id);
    }
    render() {
        let range = '0-60';
        let alt = '';
        let minuteClass = '';
        let hourClass = '';
        let dayClass = '';
        let monthClass = '';
        let weekdayClass = '';
        if(this.props.activeTab === 'cron-minute') { range = '0-60'; minuteClass = 'active';}
        else if(this.props.activeTab === 'cron-hour') { range = '0-23'; hourClass = 'active';}
        else if(this.props.activeTab === 'cron-day') { range = '1-31'; dayClass = 'active';}
        else if(this.props.activeTab === 'cron-month') { range = '1-12'; monthClass = 'active'; alt = 'JAN-DEC';}
        else if(this.props.activeTab === 'cron-weekday') { range = '0-6'; weekdayClass = 'active'; alt = 'MON-SUN';}
        return (
            <div>
                <ul className="nav nav-tabs">
                    <li role="presentation" id="cron-minute" className={minuteClass}><a onClick={this.updateTab}>Minute</a></li>
                    <li role="presentation" id="cron-hour" className={hourClass}><a onClick={this.updateTab}>Hour</a></li>
                    <li role="presentation" id="cron-day" className={dayClass}><a onClick={this.updateTab}>Day</a></li>
                    <li role="presentation" id="cron-month" className={monthClass}><a onClick={this.updateTab}>Month</a></li>
                    <li role="presentation" id="cron-weekday" className={weekdayClass}><a onClick={this.updateTab}>Day of Week</a></li>
                </ul>
                <CronSyntax range={range} alt={alt}/>
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
        let alt = '';
        if(this.props.range) {
            range = <li className="list-group-item">{this.props.range} - Acceptable Values</li>;
        }
        if(this.props.alt) {
            alt = <li className="list-group-item">{this.props.alt} - Alternative Values</li>;
        }
        return (
            <div className="Syntax">
                <ul className="list-group">
                    <li className="list-group-item">* - The asterisk operator specifies all possible values for a field.</li>
                    <li className="list-group-item">, - This comma operator specifies a list of values. Ex: 1,3,6</li>
                    <li className="list-group-item">- - The dash operator specifies a range of values. Ex: "1-5"</li>
                    <li className="list-group-item">/ - The slash operator specifies a range of step values. Ex: "0/2"</li>
                    {range}
                    {alt}
                </ul>
            </div>
        );
    }
}

class CronBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleFocusChange = this.handleFocusChange.bind(this);
        this.state = { activeTab: 'cron-minute',
                        minute: '',
                        hour: '',
                        day: '',
                        month: '',
                        weekday: '',
                        secondRegex: '^(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)$',
                        minuteRegex: '^(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)$',
                        hourRegex: '^(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?)*)$',
                        dayRegex: '^(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)$',
                        monthRegex: '^(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)$',
                        weekdayRegex: '^(\\?|\\*|(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)$',
                        yearRegex: '^(\\?|\\*|(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?)*)$'
                        }
    }
    handleValueChange(label, value) {
        this.setState({[label.toLowerCase()]: value});
    }
    handleTabChange(value){
        this.setState({activeTab: value});
    }
    handleFocusChange(label) {
        this.setState({activeTab: 'cron-' + label.toLowerCase()});
    }
    render() {
        let minuteReg = new RegExp(this.state.minuteRegex);
        let hourReg = new RegExp(this.state.hourRegex);
        let dayReg = new RegExp(this.state.dayRegex);
        let monthReg = new RegExp(this.state.monthRegex);
        let weekdayReg = new RegExp(this.state.weekdayRegex);
        let valid = (minuteReg.test(this.state.minute) && hourReg.test(this.state.hour) && dayReg.test(this.state.day) && monthReg.test(this.state.month) && weekdayReg.test(this.state.weekday));
        let cron = '';
        let pretty = '';
        let prettyNext = '';
        if(valid) {
            cron = this.state.minute + ' ' + this.state.hour + ' ' + this.state.day + ' ' + this.state.month + ' ' + this.state.weekday;
            pretty = prettyCron.toString(cron);
            prettyNext = prettyCron.getNext(cron);
        }
        else {
            pretty = 'Invalid Cron';
            prettyNext = 'undetermined'
        }
        return(
            <div>
                <h2>The Current Cron Task Is: {cron}</h2>
                <h3>{pretty}</h3>
                <h3>The next time this job will run is {prettyNext}.</h3>
                <CronField
                    label="Minute"
                    placeholder="Cron String"
                    value={this.state.minute}
                    regex={this.state.minuteRegex}
                    onChange={this.handleValueChange}
                    onFocus={this.handleFocusChange} />
                <CronField
                    label="Hour"
                    placeholder="Cron String"
                    value={this.state.hour}
                    regex={this.state.hourRegex}
                    onChange={this.handleValueChange}
                    onFocus={this.handleFocusChange} />
                <CronField
                    label="Day"
                    placeholder="Cron String"
                    value={this.state.day}
                    regex={this.state.dayRegex}
                    onChange={this.handleValueChange}
                    onFocus={this.handleFocusChange} />
                <CronField
                    label="Month"
                    placeholder="Cron String"
                    value={this.state.month}
                    regex={this.state.monthRegex}
                    onChange={this.handleValueChange}
                    onFocus={this.handleFocusChange} />
                <CronField
                    label="Weekday"
                    placeholder="Cron String"
                    value={this.state.weekday}
                    regex={this.state.weekdayRegex}
                    onChange={this.handleValueChange}
                    onFocus={this.handleFocusChange} />
                <CronTabs activeTab={this.state.activeTab} onClick={this.handleTabChange}/>
            </div>
        );
    }
}

ReactDOM.render(
     <CronBuilder />,
     document.getElementById('cron-builder-split')
);

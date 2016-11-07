var prettyCron = require('prettycron');

import React from 'react';
import ReactDOM from 'react-dom';

class CronField extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleSelect(event) {
        this.props.onSelect(event.target.selectionStart);
    }
    handleChange(event) {
        this.props.onChange(event.target.value);
    }
    render() {
        return (
            <input id={this.props.name}
                   type="text"
                   className="form-control"
                   value={this.props.value}
                   placeholder={this.props.placeholder}
                   onSelect={this.handleSelect}
                   onChange={this.handleChange} />
        );
    }
}

class CronTabs extends React.Component {
    constructor(props) {
        super(props);
        this.updateTab = this.updateTab.bind(this);
    }
    updateTab(event) {
        console.log(event.target.parentElement.id);
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
        if(this.props.activeTab === 'minute') { range = '0-60'; minuteClass = 'active';}
        else if(this.props.activeTab === 'hour') { range = '0-23'; hourClass = 'active';}
        else if(this.props.activeTab === 'day') { range = '1-31'; dayClass = 'active';}
        else if(this.props.activeTab === 'month') { range = '1-12'; monthClass = 'active'; alt = 'JAN-DEC';}
        else if(this.props.activeTab === 'weekday') { range = '0-6'; weekdayClass = 'active'; alt = 'MON-SUN';}
        return (
            <div>
                <ul className="nav nav-pills nav-justified">
                    <li role="presentation" id="minute" className={minuteClass}><a className={this.props.minuteClass} onClick={this.updateTab}>Minute</a></li>
                    <li role="presentation" id="hour" className={hourClass}><a className={this.props.hourClass} onClick={this.updateTab}>Hour</a></li>
                    <li role="presentation" id="day" className={dayClass}><a className={this.props.dayClass} onClick={this.updateTab}>Day</a></li>
                    <li role="presentation" id="month" className={monthClass}><a className={this.props.monthClass} onClick={this.updateTab}>Month</a></li>
                    <li role="presentation" id="weekday" className={weekdayClass}><a className={this.props.weekdayClass} onClick={this.updateTab}>Day of Week</a></li>
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
        this.handleCronFieldSelect = this.handleCronFieldSelect.bind(this);
        this.handleCronFieldChange = this.handleCronFieldChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.state = {
            fieldId: 'cron-field',
            caret: '',
            cron: '',
            valid: '',
            activeTab: 'minute',
            second: '',
            minute: '',
            hour: '',
            day: '',
            month: '',
            weekday: '',
            year: '',
            secondRange: '',
            minuteRange: '',
            hourRange: '',
            dayRange: '',
            monthRange: '',
            weekdayRange: '',
            yearRange: '',
            secondRegex: '^(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)$',
            minuteRegex: '^(\\?|\\*|(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?(?:,(?:[0-5]?\\d)(?:(?:-|\\/|\\,)(?:[0-5]?\\d))?)*)$',
            hourRegex: '^(\\?|\\*|(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?(?:,(?:[01]?\\d|2[0-3])(?:(?:-|\\/|\\,)(?:[01]?\\d|2[0-3]))?)*)$',
            dayRegex: '^(\\?|\\*|(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?(?:,(?:0?[1-9]|[12]\\d|3[01])(?:(?:-|\\/|\\,)(?:0?[1-9]|[12]\\d|3[01]))?)*)$',
            monthRegex: '^(\\?|\\*|(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\\/|\\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\\?|\\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)$',
            weekdayRegex: '^(\\?|\\*|(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\\/|\\,|#)(?:[0-6]))?(?:L)?)*|\\?|\\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)$',
            yearRegex: '^(\\?|\\*|(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?(?:,(?:|\\d{4})(?:(?:-|\\/|\\,)(?:|\\d{4}))?)*)$'
            }
    }
    handleCronFieldSelect(pos) {
        this.setState({caret: pos});
    }
    handleTabChange(value){
        document.getElementById(this.state.fieldId).focus();
        document.getElementById(this.state.fieldId).setSelectionRange(eval('this.state.' + value + 'Range[0]'), eval('this.state.' + value + 'Range[1]'));
        this.setState({activeTab: value, caret: eval('this.state.' + value + 'Range[0]')});
    }
    handleCronFieldChange(value) {
        let result = value.replace(/^\s+/g, "").toUpperCase();
        let split = result.split(' ');
        let split0 = (split[0] && (split[0].length));
        let split1 = (split[1] && (split[0].length+split[1].length)+1);
        let split2 = (split[2] && (split[0].length+split[1].length+split[2].length)+2);
        let split3 = (split[3] && (split[0].length+split[1].length+split[2].length+split[3].length)+3);
        let split4 = (split[4] && (split[0].length+split[1].length+split[2].length+split[3].length+split[4].length)+4);
        switch(split.length) {
            case 0: this.setState({
                cron: result,
                minute: split[0],
                hour: '',
                day: '',
                month: '',
                weekday: '',
                minuteRange: [0, split0],
                hourRange: '',
                dayRange: ''
            }); break;
            case 1: this.setState({
                cron: result,
                minute: split[0],
                hour: split[1],
                day: '',
                month: '',
                weekday: '',
                minuteRange: [0, split0],
                hourRange: [split0+1, split1],
                dayRange: [split1+1, split2],
                monthRange: [split2+1, split3],
                weekdayRange: [split3+1, split4]
                }); break;
            case 2: this.setState({
                cron: result,
                minute: split[0],
                hour: split[1],
                day: split[2],
                month: '',
                weekday: '',
                minuteRange: [0, split0],
                hourRange: [split0+1, split1],
                dayRange: [split1+1, split2],
                monthRange: [split2+1, split3],
                weekdayRange: [split3+1, split4]
                }); break;
            case 3: this.setState({cron: result,
                minute: split[0],
                hour: split[1],
                day: split[2],
                month: split[3],
                weekday: '',
                minuteRange: [0, split0],
                hourRange: [split0+1, split1],
                dayRange: [split1+1, split2],
                monthRange: [split2+1, split3],
                weekdayRange: [split3+1, split4]
                }); break;
            case 4: this.setState({
                cron: result,
                minute: split[0],
                hour: split[1],
                day: split[2],
                month: split[3],
                weekday: split[4],
                minuteRange: [0, split0],
                hourRange: [split0+1, split1],
                dayRange: [split1+1, split2],
                monthRange: [split2+1, split3],
                weekdayRange: [split3+1, split4]
            }); break;
            case 5: this.setState({
                cron: result,
                minute: split[0],
                hour: split[1],
                day: split[2],
                month: split[3],
                weekday: split[4],
                minuteRange: [0, split0],
                hourRange: [split0+1, split1],
                dayRange: [split1+1, split2],
                monthRange: [split2+1, split3],
                weekdayRange: [split3+1, split4]
            }); break;
            default: break;
        }
    }
    render() {
        let pretty = '';
        let prettyNext = '';
        let minuteClass = 'invalid';
        let hourClass = 'invalid';
        let dayClass = 'invalid';
        let monthClass = 'invalid';
        let weekdayClass = 'invalid';
        let minuteReg = new RegExp(this.state.minuteRegex);
        let hourReg = new RegExp(this.state.hourRegex);
        let dayReg = new RegExp(this.state.dayRegex);
        let monthReg = new RegExp(this.state.monthRegex);
        let weekdayReg = new RegExp(this.state.weekdayRegex);
        if(minuteReg.test(this.state.minute)) {minuteClass='valid'}
        if(hourReg.test(this.state.hour)) {hourClass='valid'}
        if(dayReg.test(this.state.day)) {dayClass='valid'}
        if(monthReg.test(this.state.month)) {monthClass='valid'}
        if(weekdayReg.test(this.state.weekday)) {weekdayClass='valid'}
        if(this.state.minuteRange[0] <= this.state.caret && this.state.caret <= this.state.minuteRange[1]) {this.state.activeTab='minute';}
        if(this.state.hourRange[0] <= this.state.caret && this.state.caret <= this.state.hourRange[1]) {this.state.activeTab='hour';}
        if(this.state.dayRange[0] <= this.state.caret && this.state.caret <= this.state.dayRange[1]) {this.state.activeTab='day';}
        if(this.state.monthRange[0] <= this.state.caret && this.state.caret <= this.state.monthRange[1]) {this.state.activeTab='month';}
        if(this.state.weekdayRange[0] <= this.state.caret && this.state.caret <= this.state.weekdayRange[1]) {this.state.activeTab='weekday';}
        if(minuteClass === 'valid' && hourClass  === 'valid' && dayClass  === 'valid' && monthClass  === 'valid' && weekdayClass === 'valid') {
            pretty = prettyCron.toString(this.state.cron);
            prettyNext = prettyCron.getNext(this.state.cron);
        }
        else {
            pretty = 'Invalid Cron';
            prettyNext = 'undetermined'
        }
        return(
            <div>
                <h2>The Current Cron Field Is: {this.state.cron}</h2>
                <h3>{pretty}</h3>
                <h3>The next time this job will run is {prettyNext}.</h3>
                <CronField name={this.state.fieldId} value={this.state.cron} placeholder="Cron Job" selection={this.state.caret} onSelect={this.handleCronFieldSelect} onChange={this.handleCronFieldChange} />
                <CronTabs activeTab={this.state.activeTab} minuteClass={minuteClass} hourClass={hourClass} dayClass={dayClass} monthClass={monthClass} weekdayClass={weekdayClass} onClick={this.handleTabChange} />
            </div>
        );
    }
}

ReactDOM.render(
     <CronBuilder />,
     document.getElementById('cron-builder')
);

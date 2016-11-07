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
                   className="form-control input-lg"
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
        if(event.target.classList.contains('label')) {
            this.props.onClick(event.target.parentElement.parentElement.id);
        }
        else {
            this.props.onClick(event.target.parentElement.id);
        }
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
            <div className="cron-tabs">
                <ul className="nav nav-tabs nav-justified">
                    <li role="presentation" id="minute" className={minuteClass}><a className={this.props.minuteClass} onClick={this.updateTab}>Minute <span className={'label label-' + this.props.minuteClass}>{this.props.minuteClass}</span></a></li>
                    <li role="presentation" id="hour" className={hourClass}><a className={this.props.hourClass} onClick={this.updateTab}>Hour <span className={'label label-' + this.props.hourClass}>{this.props.minuteClass}</span></a></li>
                    <li role="presentation" id="day" className={dayClass}><a className={this.props.dayClass} onClick={this.updateTab}>Day <span className={'label label-' + this.props.dayClass}>{this.props.dayClass}</span></a></li>
                    <li role="presentation" id="month" className={monthClass}><a className={this.props.monthClass} onClick={this.updateTab}>Month <span className={'label label-' + this.props.monthClass}>{this.props.monthClass}</span></a></li>
                    <li role="presentation" id="weekday" className={weekdayClass}><a className={this.props.weekdayClass} onClick={this.updateTab}>Weekday <span className={'label label-' + this.props.weekdayClass}>{this.props.weekdayClass}</span></a></li>
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
            caret: 0,
            cron: '0 2 1 * *',
            activeTab: 'minute',
            minute: '0',
            hour: '2',
            day: '1',
            month: '*',
            weekday: '*',
            minuteRange: [0,1],
            hourRange: [2,3],
            dayRange: [4,5],
            monthRange: [6,7],
            weekdayRange: [8,9],
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
        let start = eval('this.state.' + value + 'Range[0]');
        let stop = eval('this.state.' + value + 'Range[1]');
        console.log(start + ', ' + stop);
        if(stop === undefined || stop === '') {
            start = stop = document.getElementById(this.state.fieldId).value.length;
        }
        document.getElementById(this.state.fieldId).setSelectionRange(start, stop);
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
        let minuteClass = '';
        let hourClass = '';
        let dayClass = '';
        let monthClass = '';
        let weekdayClass = '';
        if(new RegExp(this.state.minuteRegex).test(this.state.minute)) {minuteClass='valid'} else if(this.state.minute == undefined || this.state.minute == '') {minuteClass='missing'} else {minuteClass='invalid'}
        if(new RegExp(this.state.hourRegex).test(this.state.hour)) {hourClass='valid'} else if(this.state.hour == undefined || this.state.hour == '') {hourClass='missing'} else {hourClass='invalid'}
        if(new RegExp(this.state.dayRegex).test(this.state.day)) {dayClass='valid'} else if(this.state.day == undefined || this.state.day == '') {dayClass='missing'} else {dayClass='invalid'}
        if(new RegExp(this.state.monthRegex).test(this.state.month)) {monthClass='valid'} else if(this.state.month == undefined || this.state.month == '') {monthClass='missing'} else {monthClass='invalid'}
        if(new RegExp(this.state.weekdayRegex).test(this.state.weekday)) {weekdayClass='valid'} else if(this.state.weekday == undefined || this.state.weekday == '') {weekdayClass='missing'} else {weekdayClass='invalid'}
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
                <h1 className="text-center">{pretty}</h1>
                <h5 className="text-center">The next time this job will run is {prettyNext}.</h5>
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

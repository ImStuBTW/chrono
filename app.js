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
            <input type="text"
                   className="form-control"
                   value={this.props.value}
                   placeholder={this.props.placeholder}
                   onSelect={this.handleSelect}
                   onChange={this.handleChange} />
        );
    }
}

class CronBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.handleCronFieldSelect = this.handleCronFieldSelect.bind(this);
        this.handleCronFieldChange = this.handleCronFieldChange.bind(this);
        this.state = {
            caret: '',
            cron: '',
            valid: '',
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
    handleCronFieldChange(value) {
        let result = value.replace(/^\s+/g, "").toUpperCase();
        let split = result.split(' ');
        console.log(split);
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
        if(minuteReg.test(this.state.minute)) {minuteClass='valid'} else {minuteClass='invalid'}
        if(hourReg.test(this.state.hour)) {hourClass='valid'} else {hourClass='invalid'}
        if(dayReg.test(this.state.day)) {dayClass='valid'} else {dayClass='invalid'}
        if(monthReg.test(this.state.month)) {monthClass='valid'} else {monthClass='invalid'}
        if(weekdayReg.test(this.state.weekday)) {weekdayClass='valid'} else {weekdayClass='invalid'}
        if(this.state.minuteRange[0] <= this.state.caret && this.state.caret <= this.state.minuteRange[1]) {minuteClass='active'}
        if(this.state.hourRange[0] <= this.state.caret && this.state.caret <= this.state.hourRange[1]) {hourClass='active'}
        if(this.state.dayRange[0] <= this.state.caret && this.state.caret <= this.state.dayRange[1]) {dayClass='active'}
        if(this.state.monthRange[0] <= this.state.caret && this.state.caret <= this.state.monthRange[1]) {monthClass='active'}
        if(this.state.weekdayRange[0] <= this.state.caret && this.state.caret <= this.state.weekdayRange[1]) {weekdayClass='active'}
        return(
            <div>
                <h2>The Current Cron Field Is: {this.state.cron}</h2>
                <h3>Caret Position: {this.state.caret}</h3>
                <h3 className={minuteClass}>minute: {this.state.minute}, length: {this.state.minute && this.state.minute.length}</h3>
                    <h3 className={hourClass}>hour: {this.state.hour}, length: {this.state.hour && this.state.hour.length}</h3>
                <h3 className={dayClass}>day: {this.state.day}, length: {this.state.day && this.state.day.length}</h3>
                <h3 className={monthClass}>month: {this.state.month}, length: {this.state.month && this.state.month.length}</h3>
                <h3 className={weekdayClass}>weekday: {this.state.weekday}, length: {this.state.weekday && this.state.weekday.length}</h3>
                <CronField value={this.state.cron} placeholder="Cron Job" onSelect={this.handleCronFieldSelect} onChange={this.handleCronFieldChange} />
            </div>
        );
    }
}

ReactDOM.render(
     <CronBuilder />,
     document.getElementById('cron-builder')
);

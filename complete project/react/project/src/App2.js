import React from 'react';
import immutable from 'immutable';

export default class extends React.Component {

    constructor() {
        super();
        this.state = {
            text_value: immutable.fromJS({ text: "" })
        }
    }

    change_queue = []
    back_index = -1

    set_text_value(val) {
        // this.setState({
        //     text_value:this.state.text_value.set('text',val)
        // })


        //修复队列
        if (this.back_index > -1) {
            this.change_queue = this.change_queue.slice(0, this.back_index + 1);
        }
        //修改操作
        this.change_queue.push(this.state.text_value);
        this.setState({
            text_value: this.state.text_value.set("text", val)
        });
        this.back_index = -1;

        console.log(this.change_queue);
    }

    go_prev() {
        if (this.back_index < 0) {
            this.change_queue.push(this.state.text_value);
            this.back_index = this.change_queue.length - 1;
        } else {
            this.back_index--;
        }
        console.log('后退', this.back_index)
        this.setState({
            text_value: this.change_queue[this.back_index]
        });
    }

    go_next() {
        console.log("前进")
        this.back_index++;
        this.setState({
            text_value: this.change_queue[this.back_index]
        });
    }

    render() {
        return (
            <div>
                <textarea
                    style={{ width: 300, height: 200 }}
                    row='5'
                    onChange={
                        (e) => this.set_text_value(e.target.value)
                    }
                    value={this.state.text_value.get("text")}
                >
                </textarea>
                <br />
                <button type="button"
                    onClick={() => this.go_prev()}
                    disabled={this.change_queue.length === 0 || this.back_index === 0}
                >后退</button>
                <button type="button"
                    onClick={() => this.go_next()}
                    disabled={!((this.back_index >= 0) && (this.back_index < this.change_queue.length - 1))}
                >前进</button>
            </div>
        )
    }
}
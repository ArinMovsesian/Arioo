import React from 'react';
import ReactTelInput from 'react-telephone-input/lib/withStyles';

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

export default class PhoneInput extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
    }
  }

  render(){
    return (
      <div style={styles}>
        <ReactTelInput
          flagsImagePath={
            "https://raw.githubusercontent.com/mukeshsoni/react-telephone-input/master/example/src/flags.png"
          }
          onChange={value => this.setState({ value })}
          initialValue="+1"
          defaultCountry="us"
          onEnterKeyPress={() => console.log("onEnterKeyPress")}
          inputProps={{autoFocus: false}}
        />
      </div>
    );
  }
}

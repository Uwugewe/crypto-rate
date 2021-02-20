import React, {Component} from 'react';
import './Crypto.css';
import CryptoList from './CryptoList';
import axios from 'axios';

class Crypto extends Component {

    constructor (props) {
        super(props);

        this.state = {
            cryptoList: [],
            filteredCryptoList: []
        }
    }

    componentDidMount() {
        this.getCryptoData();
        this.timerID = setInterval( () => {
            this.getCryptoData();
        },5000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    getCryptoData = () => {
        axios.get('https://blockchain.info/pl/ticker')
            .then(res => {
                const tickers = res.data;

                this.setState((state) => {
                    let newCryptoList = [];

                    for(const [ticker, cryptoRate] of Object.entries(tickers)){

                        let lastCryptoObject = state.cryptoList.find( (cryptoObject) => {
                            return(cryptoObject.currency === ticker)
                        });

                        let newCryptoObject = {
                            currency: ticker,
                            symbol: cryptoRate.symbol,
                            buy: cryptoRate.buy,
                            sell: cryptoRate.sell,
                            last: cryptoRate.last
                        }

                        if (lastCryptoObject !== undefined) {
                            
                            if (newCryptoObject.last > lastCryptoObject.last) {
                                newCryptoObject.cssClass = 'green';
                                newCryptoObject.htmlArray = String.fromCharCode(8593);  
                            } else if (newCryptoObject.last < lastCryptoObject.last) {
                                newCryptoObject.cssClass = 'red';
                                newCryptoObject.htmlArray = String.fromCharCode(8595);
                            } else {
                                newCryptoObject.cssClass = 'blue';
                                newCryptoObject.htmlArray = String.fromCharCode(8596);
                            }

                        } else {
                            newCryptoObject.cssClass = 'blue';
                            newCryptoObject.htmlArray = String.fromCharCode(8596);
                        }

                        newCryptoList.push(newCryptoObject);
                    }

                    return({
                        cryptoList: newCryptoList
                    })
                });
                this.filterCryptoList();
            });
    }

    filterCryptoList = () => {
        this._inputFilter.value = this._inputFilter.value.trim().toUpperCase();

        this.setState( (state) => {

            let newfilteredCryptoList = state.cryptoList.filter( (cryptoObject) => {
                return(
                    cryptoObject.currency.includes(this._inputFilter.value)
                    )
            })
            
            return({filteredCryptoList: newfilteredCryptoList})

        })
    }

    render() {
        return(
            <div>
                <div className='Crypto'>
                <input ref={(element) => {this._inputFilter = element}} type='text' placeholder='Filter' onChange={this.filterCryptoList} />
                </div>
                <CryptoList CryptoList={this.state.filteredCryptoList}/>
            </div>
        )
    }
}

export default Crypto;
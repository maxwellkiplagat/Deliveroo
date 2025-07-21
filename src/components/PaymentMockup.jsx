import React,{ useState} from "react";
import { CreditCard, Lock, Check AlertCircle, Shield} from 'lucide-react'

function PaymentMockup({amount, onPaymentComplete, onCancel}){
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardData, setCardData] = useState({
        number:'',
        expiry:'',
        cvv:'',
        name:''
    });
}
const [processing, setProcessing] = useState(false);
const [completed, setCompleted] = useState(false);

const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
}
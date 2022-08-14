import './square.css';

function Square(props) {

    return (
       <button className="square" onClick={props.mark}>
            {props.value}
       </button>
    )
}

export default Square;
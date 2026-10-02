import "./Dialogue.css";

function Dialogue({
  dialogue
}) {

  if (!dialogue) {
    return null;
  }

  return (
    <div className="dialogue">

      <div className="dialogue-box">

        <span className="dialogue-name">
          {dialogue.name}
        </span>

        <p className="dialogue-text">
          {dialogue.text}
        </p>

        <span className="dialogue-hint">
          ESPACIO / ENTER
        </span>

      </div>

    </div>
  );
}

export default Dialogue;
import { events } from '../data/events';

export default function EventDetails({ eventId, onBack }) {
  const ev = events.find((e) => e.id === eventId);

  if (!ev) return null;

  return (
    <div className="event-details">
      <div className="event-details-inner">
        <button className="back-link" onClick={onBack}>
          ← Back to Journey
        </button>

        <div className="modal-type">{ev.type}</div>
        <h1 className="modal-title">{ev.title}</h1>
        <p className="modal-desc">{ev.description}</p>

        <div className="modal-stats">
          <div className="stat">
            <div className="stat-label">Date</div>
            <div className="stat-value">{ev.date}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Team Size</div>
            <div className="stat-value">{ev.team}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Entry Fee</div>
            <div className="stat-value">{ev.fee}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Prize Pool</div>
            <div className="stat-value">{ev.prize}</div>
          </div>
        </div>

        <a href="#" className="modal-register">
          Register Now →
        </a>
      </div>
    </div>
  );
}

import React from 'react';
import PropTypes from 'prop-types';

const MultiDaySelector = ({ weekend, setWeekend }) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const toggleDay = (day) => {
        setWeekend((prevWeekend = []) => {
            const updatedWeekend = Array.isArray(prevWeekend) ? prevWeekend : [];
            return updatedWeekend.includes(day)
                ? updatedWeekend.filter((d) => d !== day)
                : [...updatedWeekend, day];
        });
    };

    return (
        <div className="container mt-3" style={{ maxWidth: '600px' }}>
            <h5>Select weekly holidays</h5>
            <div className="btn-group btn-group-sm" role="group" aria-label="Weekdays">
                {daysOfWeek.map((day, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`btn ${weekend.includes(day) ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => toggleDay(day)}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
};

MultiDaySelector.propTypes = {
    weekend: PropTypes.array.isRequired,
    setWeekend: PropTypes.func.isRequired,
};

export default MultiDaySelector;

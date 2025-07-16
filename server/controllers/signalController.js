const generateSignal = () => {
  return {
    bigSmall: Math.random() > 0.5 ? 'BIG' : 'SMALL',
    greenRed: Math.random() > 0.5 ? 'GREEN' : 'RED',
    numbers: [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ],
    timestamp: new Date()
  };
};

exports.getSignals = async (req, res) => {
  try {
    const signals = {
      thirtySeconds: generateSignal(),
      oneMinute: generateSignal(),
      threeMinutes: generateSignal(),
      fiveMinutes: generateSignal()
    };
    
    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate signals' });
  }
};
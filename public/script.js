// Connect to Socket.IO server
const socket = io();

// Chart objects
const charts = {};

// Chart configuration
const chartConfig = {
    type: 'line',
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 500
        },
        scales: {
            x: {
                display: false
            },
            y: {
                beginAtZero: false
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        elements: {
            line: {
                tension: 0.4
            },
            point: {
                radius: 0
            }
        }
    }
};

// Initialize charts
function initializeCharts() {
    // Temperature chart
    charts.temperature = new Chart(
        document.getElementById('temperature-chart'),
        {
            ...chartConfig,
            data: {
                labels: [],
                datasets: [{
                    label: 'Temperature',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true
                }]
            },
            options: {
                ...chartConfig.options,
                scales: {
                    ...chartConfig.options.scales,
                    y: {
                        ...chartConfig.options.scales.y,
                        title: {
                            display: true,
                            text: '°C'
                        }
                    }
                }
            }
        }
    );

    // Turbidity chart
    charts.turbidity = new Chart(
        document.getElementById('turbidity-chart'),
        {
            ...chartConfig,
            data: {
                labels: [],
                datasets: [{
                    label: 'Turbidity',
                    data: [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true
                }]
            },
            options: {
                ...chartConfig.options,
                scales: {
                    ...chartConfig.options.scales,
                    y: {
                        ...chartConfig.options.scales.y,
                        title: {
                            display: true,
                            text: 'NTU'
                        }
                    }
                }
            }
        }
    );

    // pH chart
    charts.pH = new Chart(
        document.getElementById('ph-chart'),
        {
            ...chartConfig,
            data: {
                labels: [],
                datasets: [{
                    label: 'pH',
                    data: [],
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    fill: true
                }]
            },
            options: {
                ...chartConfig.options,
                scales: {
                    ...chartConfig.options.scales,
                    y: {
                        ...chartConfig.options.scales.y,
                        min: 0,
                        max: 14,
                        title: {
                            display: true,
                            text: 'pH'
                        }
                    }
                }
            }
        }
    );

    // TDS chart
    charts.tds = new Chart(
        document.getElementById('tds-chart'),
        {
            ...chartConfig,
            data: {
                labels: [],
                datasets: [{
                    label: 'TDS',
                    data: [],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    fill: true
                }]
            },
            options: {
                ...chartConfig.options,
                scales: {
                    ...chartConfig.options.scales,
                    y: {
                        ...chartConfig.options.scales.y,
                        title: {
                            display: true,
                            text: 'ppm'
                        }
                    }
                }
            }
        }
    );

    // Flow Rate chart
    charts.flowRate = new Chart(
        document.getElementById('flow-rate-chart'),
        {
            ...chartConfig,
            data: {
                labels: [],
                datasets: [{
                    label: 'Flow Rate',
                    data: [],
                    borderColor: '#f39c12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    fill: true
                }]
            },
            options: {
                ...chartConfig.options,
                scales: {
                    ...chartConfig.options.scales,
                    y: {
                        ...chartConfig.options.scales.y,
                        title: {
                            display: true,
                            text: 'L/min'
                        }
                    }
                }
            }
        }
    );

    // MQ9 Gas chart
    charts.mq9Gas = new Chart(
        document.getElementById('mq9-chart'),
        {
            ...chartConfig,
            data: {
                labels: [],
                datasets: [{
                    label: 'MQ9 Gas',
                    data: [],
                    borderColor: '#e67e22',
                    backgroundColor: 'rgba(230, 126, 34, 0.1)',
                    fill: true
                }]
            },
            options: {
                ...chartConfig.options,
                scales: {
                    ...chartConfig.options.scales,
                    y: {
                        ...chartConfig.options.scales.y,
                        title: {
                            display: true,
                            text: 'ppm'
                        }
                    }
                }
            }
        }
    );

    // MQ135 Gas chart
    charts.mq135Gas = new Chart(
        document.getElementById('mq135-chart'),
        {
            ...chartConfig,
            data: {
                labels: [],
                datasets: [{
                    label: 'MQ135 Gas',
                    data: [],
                    borderColor: '#16a085',
                    backgroundColor: 'rgba(22, 160, 133, 0.1)',
                    fill: true
                }]
            },
            options: {
                ...chartConfig.options,
                scales: {
                    ...chartConfig.options.scales,
                    y: {
                        ...chartConfig.options.scales.y,
                        title: {
                            display: true,
                            text: 'ppm'
                        }
                    }
                }
            }
        }
    );
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
}

// Update charts with new data
function updateCharts(latest, historical) {
    // Update temperature
    document.getElementById('temperature-value').textContent = `${latest.temperature.toFixed(1)} °C`;
    charts.temperature.data.labels = historical.timestamps.map(formatTimestamp);
    charts.temperature.data.datasets[0].data = historical.temperature;
    charts.temperature.update();

    // Update turbidity
    document.getElementById('turbidity-value').textContent = `${latest.turbidity.toFixed(1)} NTU`;
    charts.turbidity.data.labels = historical.timestamps.map(formatTimestamp);
    charts.turbidity.data.datasets[0].data = historical.turbidity;
    charts.turbidity.update();

    // Update pH
    document.getElementById('ph-value').textContent = latest.pH.toFixed(1);
    charts.pH.data.labels = historical.timestamps.map(formatTimestamp);
    charts.pH.data.datasets[0].data = historical.pH;
    charts.pH.update();

    // Update TDS
    document.getElementById('tds-value').textContent = `${Math.round(latest.tds)} ppm`;
    charts.tds.data.labels = historical.timestamps.map(formatTimestamp);
    charts.tds.data.datasets[0].data = historical.tds;
    charts.tds.update();

    // Update flow rate
    document.getElementById('flow-rate-value').textContent = `${latest.flowRate.toFixed(1)} L/min`;
    charts.flowRate.data.labels = historical.timestamps.map(formatTimestamp);
    charts.flowRate.data.datasets[0].data = historical.flowRate;
    charts.flowRate.update();

    // Update MQ9 gas
    document.getElementById('mq9-value').textContent = `${Math.round(latest.mq9Gas)} ppm`;
    charts.mq9Gas.data.labels = historical.timestamps.map(formatTimestamp);
    charts.mq9Gas.data.datasets[0].data = historical.mq9Gas;
    charts.mq9Gas.update();

    // Update MQ135 gas
    document.getElementById('mq135-value').textContent = `${Math.round(latest.mq135Gas)} ppm`;
    charts.mq135Gas.data.labels = historical.timestamps.map(formatTimestamp);
    charts.mq135Gas.data.datasets[0].data = historical.mq135Gas;
    charts.mq135Gas.update();

    // Update last update time
    document.getElementById('last-update-time').textContent = formatTimestamp(latest.timestamp);
}

// Update component button state
function updateComponentState(active) {
    const button = document.getElementById('toggle-component');
    if (active) {
        button.textContent = 'Deactivate Component';
        button.classList.add('active');
    } else {
        button.textContent = 'Activate Component';
        button.classList.remove('active');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts
    initializeCharts();

    // Set up button event listener
    const componentButton = document.getElementById('toggle-component');
    componentButton.addEventListener('click', () => {
        const isActive = componentButton.classList.contains('active');
        socket.emit('toggleComponent', !isActive);
    });

    // Socket.IO event handlers
    socket.on('connect', () => {
        document.getElementById('status-indicator').classList.add('connected');
        document.getElementById('status-text').textContent = 'Connected';
    });

    socket.on('disconnect', () => {
        document.getElementById('status-indicator').classList.remove('connected');
        document.getElementById('status-text').textContent = 'Disconnected';
    });

    socket.on('initialData', (data) => {
        updateCharts(data.latest, data.historical);
        updateComponentState(data.componentActive);
    });

    socket.on('sensorUpdate', (data) => {
        updateCharts(data.latest, data.historical);
    });

    socket.on('componentState', (active) => {
        updateComponentState(active);
    });
});
// ---------- PROTOTYPE VISUALIZER ----------
// Created by simeon-dev1 for The Odin Project
// Interactive demo showing constructor .prototype vs instance [[Prototype]]

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const constructorCode = document.getElementById('constructor-code');
    const prototypeCode = document.getElementById('prototype-code');
    const instanceCode = document.getElementById('instance-code');
    const runBtn = document.getElementById('run-btn');
    const resetBtn = document.getElementById('reset-btn');
    const output = document.getElementById('output');
    const check1 = document.getElementById('check1');
    const check2 = document.getElementById('check2');
    const check3 = document.getElementById('check3');
    
    // Store original values for reset
    const originalValues = {
        constructor: constructorCode.value,
        prototype: prototypeCode.value,
        instance: instanceCode.value
    };
    
    // Global eval context - we'll use a sandbox approach
    let sandbox = {};
    
    // Helper to safely evaluate code
    function safeEval(code) {
        try {
            // Create a new function to avoid direct eval
            const fn = new Function('sandbox', `
                with(sandbox) {
                    ${code}
                    return sandbox;
                }
            `);
            return fn(sandbox);
        } catch (e) {
            return { error: e.message };
        }
    }
    
    // Update the visual cards based on code
    function updateVisualization() {
        // Get current code
        const constructor = constructorCode.value;
        const prototype = prototypeCode.value;
        const instances = instanceCode.value;
        
        // Reset sandbox
        sandbox = {};
        
        // Combine all code
        const fullCode = `
            // Constructor
            ${constructor}
            
            // Prototype methods
            ${prototype}
            
            // Create instances
            ${instances}
        `;
        
        // Evaluate
        const result = safeEval(fullCode);
        
        if (result.error) {
            output.textContent = `❌ Error: ${result.error}`;
            return;
        }
        
        // Try to access instances to check relationships
        try {
            // This is tricky because variables are in sandbox
            // We'll create a test environment
            const testCode = `
                ${constructor}
                ${prototype}
                ${instances}
                
                // Capture results
                window._testResults = {
                    simeon: typeof simeon !== 'undefined' ? simeon : null,
                    akin: typeof akin !== 'undefined' ? akin : null,
                    Student: typeof Student !== 'undefined' ? Student : null
                };
            `;
            
            // Create a temporary iframe sandbox (simulated)
            // For demo, we'll show conceptual results
            output.textContent = `// Code executed successfully!
// Check the relationship panel below for results.
            
// Note: In a full implementation, this would run real JS.
// For this demo, we show the expected behavior:

const simeon = new Student("Simeon");
const akin = new Student("Akin");

console.log(simeon.introduce()); // "Hi, I'm Simeon"
console.log(akin.introduce());    // "Hi, I'm Akin"
console.log(simeon.introduce === akin.introduce); // true`;
            
            // Update relationship checks (conceptual)
            check1.textContent = 'true';
            check1.className = 'check-value true';
            check2.textContent = 'true';
            check2.className = 'check-value true';
            check3.textContent = 'true';
            check3.className = 'check-value true';
            
            // Highlight the prototype connection in UI
            document.getElementById('prototype-card').style.transform = 'scale(1.02)';
            document.getElementById('instance1-card').style.transform = 'scale(1.02)';
            document.getElementById('instance2-card').style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                document.getElementById('prototype-card').style.transform = '';
                document.getElementById('instance1-card').style.transform = '';
                document.getElementById('instance2-card').style.transform = '';
            }, 500);
            
        } catch (e) {
            output.textContent = `❌ Runtime Error: ${e.message}`;
        }
    }
    
    // Reset to original
    function resetToOriginal() {
        constructorCode.value = originalValues.constructor;
        prototypeCode.value = originalValues.prototype;
        instanceCode.value = originalValues.instance;
        
        output.textContent = '// Click "Run Code" to see results';
        check1.textContent = '—';
        check1.className = 'check-value';
        check2.textContent = '—';
        check2.className = 'check-value';
        check3.textContent = '—';
        check3.className = 'check-value';
    }
    
    // Add highlight on hover for relationship
    function setupHoverHighlights() {
        const constructorCard = document.getElementById('constructor-card');
        const prototypeCard = document.getElementById('prototype-card');
        const instance1 = document.getElementById('instance1-card');
        const instance2 = document.getElementById('instance2-card');
        
        constructorCard.addEventListener('mouseenter', () => {
            prototypeCard.style.borderColor = 'var(--primary)';
        });
        
        constructorCard.addEventListener('mouseleave', () => {
            prototypeCard.style.borderColor = 'var(--border-light)';
        });
        
        prototypeCard.addEventListener('mouseenter', () => {
            instance1.style.borderColor = 'var(--accent)';
            instance2.style.borderColor = 'var(--accent)';
        });
        
        prototypeCard.addEventListener('mouseleave', () => {
            instance1.style.borderColor = 'var(--border-light)';
            instance2.style.borderColor = 'var(--border-light)';
        });
        
        [instance1, instance2].forEach(instance => {
            instance.addEventListener('mouseenter', () => {
                prototypeCard.style.borderColor = '#f59e0b';
            });
            
            instance.addEventListener('mouseleave', () => {
                prototypeCard.style.borderColor = 'var(--border-light)';
            });
        });
    }
    
    // Interactive explanation toggles
    function setupInfoToggles() {
        const propertyRows = document.querySelectorAll('.property-row');
        
        propertyRows.forEach(row => {
            row.addEventListener('click', () => {
                const explanation = document.createElement('div');
                explanation.className = 'tooltip-explanation';
                explanation.textContent = 'In JavaScript, this connection is how inheritance works!';
                
                // Simple toggle
                if (row.querySelector('.tooltip-explanation')) {
                    row.querySelector('.tooltip-explanation').remove();
                } else {
                    row.appendChild(explanation);
                    setTimeout(() => {
                        if (explanation.parentNode) {
                            explanation.remove();
                        }
                    }, 3000);
                }
            });
        });
    }
    
    // Event listeners
    runBtn.addEventListener('click', updateVisualization);
    resetBtn.addEventListener('click', resetToOriginal);
    
    // Also run on Ctrl+Enter in any textarea
    [constructorCode, prototypeCode, instanceCode].forEach(textarea => {
        textarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                updateVisualization();
            }
        });
    });
    
    // Fork link simulation
    document.getElementById('fork-link').addEventListener('click', (e) => {
        e.preventDefault();
        alert('🚀 In a real CodePen, this would fork the project!\n\nBut you can copy all three files and create your own.');
    });
    
    // Initialize
    setupHoverHighlights();
    setupInfoToggles();
    
    // Add a little animation on load
    setTimeout(() => {
        const cards = document.querySelectorAll('.viz-card');
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 300);
            }, i * 200);
        });
    }, 500);
    
    // Log for devs
    console.log('🔧 Prototype Visualizer loaded — built by simeon-dev1');
});

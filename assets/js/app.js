const { createApp, ref, onMounted } = Vue;

const app = createApp({
    setup() {
        const messages = ref([]);
        const userInput = ref('');
        const activeTab = ref('chat');
        const generatedCode = ref('');
        const isGenerating = ref(false);

        // Template suggestions
        const templates = [
            'GAME OF LIFE',
            'SNAKE GAME',
            'AI CHATBOT',
            'MINECRAFT CLONE'
        ];

        // Function to add a message to the chat
        const addMessage = (content, isUser = true) => {
            messages.value.push({
                content,
                isUser,
                timestamp: new Date().toISOString()
            });
        };

        // Function to handle user input submission
        const handleSubmit = async () => {
            if (!userInput.value.trim()) return;

            const input = userInput.value;
            addMessage(input, true);
            userInput.value = '';

            // Show AI is thinking
            isGenerating.value = true;
            
            try {
                // Process the user's request
                const userRequest = input.toLowerCase();
                let aiResponse = '';
                
                if (userRequest.includes('create') || userRequest.includes('generate') || userRequest.includes('make')) {
                    // Generate code based on request
                    aiResponse = "I'll help you create that. Here's a basic implementation to get started.";
                    addMessage(aiResponse, false);
                    
                    // Generate appropriate code
                    if (userRequest.includes('snake game')) {
                        generatedCode.value = generateSnakeGame();
                    } else if (userRequest.includes('game of life')) {
                        generatedCode.value = generateGameOfLife();
                    } else if (userRequest.includes('chatbot')) {
                        generatedCode.value = generateChatbot();
                    } else if (userRequest.includes('minecraft')) {
                        generatedCode.value = generateMinecraftClone();
                    } else {
                        generatedCode.value = generateBasicApp(input);
                    }
                } else {
                    // Handle general questions
                    aiResponse = "I can help you create various applications and generate code. Try asking me to create a specific type of application!";
                    addMessage(aiResponse, false);
                }
                
                // Highlight the code
                hljs.highlightAll();
            } catch (error) {
                addMessage("I apologize, but I encountered an error. Please try again.", false);
                console.error('Error:', error);
            } finally {
                isGenerating.value = false;
            }
        };

        // Function to switch tabs
        const switchTab = (tab) => {
            activeTab.value = tab;
            
            // Initialize game when switching to preview tab
            if (tab === 'preview' && generatedCode.value.includes('SnakeGame')) {
                // Wait for Vue to update the DOM
                setTimeout(() => {
                    try {
                        // Execute the generated code and initialize the game
                        const gameCode = generatedCode.value;
                        const gameFunction = new Function(gameCode);
                        gameFunction();
                        window.initSnakeGame();
                    } catch (error) {
                        console.error('Error initializing game:', error);
                    }
                }, 100);
            }
        };

        // Handle template selection
        const selectTemplate = (template) => {
            userInput.value = `Create a ${template.toLowerCase()} application`;
            handleSubmit();
        };

        // Code generation functions
        const generateSnakeGame = () => {
            return `// Snake Game Implementation
(() => {
    class SnakeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.gameLoop = setInterval(this.update.bind(this), 100);
    }

    generateFood() {
        return {
            x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
            y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
        };
    }

    handleKeyPress(event) {
        const directions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };
        
        if (directions[event.key]) {
            this.direction = directions[event.key];
        }
    }

    update() {
        if (this.gameOver) {
            clearInterval(this.gameLoop);
            return;
        }

        const head = {...this.snake[0]};
        
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        if (this.checkCollision(head)) {
            this.gameOver = true;
            return;
        }

        this.snake.unshift(head);
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        return head.x < 0 || 
               head.x >= this.canvas.width / this.gridSize ||
               head.y < 0 || 
               head.y >= this.canvas.height / this.gridSize ||
               this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    draw() {
        this.ctx.fillStyle = '#1a1b26';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#50fa7b';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw food
        this.ctx.fillStyle = '#ff5555';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );

        // Draw score
        this.ctx.fillStyle = '#f8f8f2';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Score: ' + this.score, 10, 30);
    }
}

    // Initialize game when the canvas is ready
    window.initSnakeGame = () => {
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            new SnakeGame('gameCanvas');
        }
    };
})();`;
        };

        const generateGameOfLife = () => {
            return `// Conway's Game of Life Implementation
class GameOfLife {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill().map(() => 
            Array(width).fill().map(() => Math.random() > 0.7)
        );
    }

    nextGeneration() {
        const newGrid = Array(this.height).fill().map(() => Array(this.width).fill(false));
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const neighbors = this.countNeighbors(x, y);
                if (this.grid[y][x]) {
                    newGrid[y][x] = neighbors === 2 || neighbors === 3;
                } else {
                    newGrid[y][x] = neighbors === 3;
                }
            }
        }
        
        this.grid = newGrid;
    }

    countNeighbors(x, y) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const nx = (x + dx + this.width) % this.width;
                const ny = (y + dy + this.height) % this.height;
                
                if (this.grid[ny][nx]) count++;
            }
        }
        return count;
    }
}`;
        };

        const generateChatbot = () => {
            return `// Simple Chatbot Implementation
class Chatbot {
    constructor() {
        this.responses = {
            'hello': ['Hi there!', 'Hello!', 'Greetings!'],
            'how are you': ['I am doing well, thanks!', 'Great, how about you?'],
            'bye': ['Goodbye!', 'See you later!', 'Take care!']
        };
    }

    respond(input) {
        const normalized = input.toLowerCase().trim();
        
        for (const [key, responses] of Object.entries(this.responses)) {
            if (normalized.includes(key)) {
                return responses[Math.floor(Math.random() * responses.length)];
            }
        }
        
        return "I am not sure how to respond to that.";
    }
}`;
        };

        const generateMinecraftClone = () => {
            return `// Basic Minecraft-style Game
class MinecraftClone {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        
        this.blocks = new Map();
        this.selectedBlock = 'grass';
        
        this.init();
    }
    
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 5;
        
        const light = new THREE.AmbientLight(0x404040);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.scene.add(light);
        this.scene.add(directionalLight);
        
        this.createGround();
        this.animate();
    }
    
    createGround() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        
        for (let x = -10; x < 10; x++) {
            for (let z = -10; z < 10; z++) {
                const block = new THREE.Mesh(geometry, material);
                block.position.set(x, -1, z);
                this.scene.add(block);
            }
        }
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}`;
        };

        const generateBasicApp = (input) => {
            return `// Basic Application Structure
class App {
    constructor() {
        this.name = "Generated App";
        this.description = "${input}";
        this.version = "1.0.0";
    }

    init() {
        console.log("Starting " + this.name + "...");
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('App loaded!');
        });
    }

    render() {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = '<div class="container">' +
                '<h1>' + this.name + '</h1>' +
                '<p>' + this.description + '</p>' +
                '</div>';
        }
    }
}`;
        };

        onMounted(() => {
            hljs.highlightAll();
        });

        return {
            messages,
            userInput,
            activeTab,
            generatedCode,
            isGenerating,
            templates,
            handleSubmit,
            switchTab,
            selectTemplate
        };
    }
});

app.mount('#app');

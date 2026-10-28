import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.Random;

public class Game extends JPanel implements ActionListener, KeyListener {
    private static final int WIDTH = 400;
    private static final int HEIGHT = 500;
    private static final int PLAYER_SIZE = 30;
    private static final int PLAYER_Y = HEIGHT - 50;

    private Timer timer;
    private int playerX = WIDTH / 2 - PLAYER_SIZE / 2;
    private int score = 0;
    private boolean gameOver = false;
    private long lastSpawnTime = 0;
    private ArrayList<Star> stars = new ArrayList<>();
    private Random random = new Random();

    public Game() {
        setPreferredSize(new Dimension(WIDTH, HEIGHT));
        setBackground(Color.BLACK);
        setFocusable(true);
        addKeyListener(this);

        timer = new Timer(30, this);
        timer.start();
    }

    public void actionPerformed(ActionEvent e) {
        if (!gameOver) {
            updateGame();
            repaint();
        }
    }

    private void updateGame() {
        long now = System.currentTimeMillis();

        if (now - lastSpawnTime > 700) {
            int x = random.nextInt(WIDTH - 20);
            stars.add(new Star(x, -20));
            lastSpawnTime = now;
        }

        for (int i = 0; i < stars.size(); i++) {
            Star s = stars.get(i);
            s.y += 4;

            if (s.y + 10 >= PLAYER_Y && s.y <= PLAYER_Y + PLAYER_SIZE) {
                if (s.x + 10 > playerX && s.x < playerX + PLAYER_SIZE) {
                    gameOver = true;
                }
            }

            if (s.y > HEIGHT) {
                score++;
                stars.remove(i);
                i--;
            }
        }
    }

    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        g.setColor(Color.WHITE);
        g.setFont(new Font("Arial", Font.BOLD, 20));

        if (!gameOver) {
            // draw player
            g.setColor(Color.GREEN);
            g.fillRect(playerX, PLAYER_Y, PLAYER_SIZE, PLAYER_SIZE);

            // draw stars
            g.setColor(Color.YELLOW);
            for (Star s : stars) {
                g.fillOval(s.x, s.y, 10, 10);
            }

            // draw score
            g.setColor(Color.WHITE);
            g.drawString("Score: " + score, 20, 30);
        } else {
            g.setColor(Color.RED);
            g.drawString("Game Over", WIDTH / 2 - 60, HEIGHT / 2);
            g.drawString("Final Score: " + score, WIDTH / 2 - 75, HEIGHT / 2 + 30);
            g.drawString("Press R to Restart", WIDTH / 2 - 90, HEIGHT / 2 + 60);
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        int key = e.getKeyCode();

        if (key == KeyEvent.VK_LEFT) {
            playerX = Math.max(0, playerX - 20);
        } else if (key == KeyEvent.VK_RIGHT) {
            playerX = Math.min(WIDTH - PLAYER_SIZE, playerX + 20);
        } else if (key == KeyEvent.VK_R && gameOver) {
            resetGame();
        }
    }

    private void resetGame() {
        score = 0;
        gameOver = false;
        stars.clear();
        playerX = WIDTH / 2 - PLAYER_SIZE / 2;
        lastSpawnTime = 0;
    }

    @Override
    public void keyReleased(KeyEvent e) { }
    @Override
    public void keyTyped(KeyEvent e) { }

    static class Star {
    int x, y;
    Star(int x, int y) {
        this.x = x;
        this.y = y;
    }
}

    public static void main(String[] args) {
    JFrame frame = new JFrame("Star Dodge");
    Game game = new Game();

    frame.add(game);
    frame.pack();
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    frame.setLocationRelativeTo(null);
    frame.setVisible(true);

    game.requestFocusInWindow();
}
}

import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.io.IOException;

public class JmxAppExample {

    public static void main(String[] args) {
        boolean exit = false;
        String readLine;
        InputStreamReader inputStream = new InputStreamReader(System.in);
        BufferedReader stdin = new BufferedReader(inputStream);
        System.out.print("> ");
        while (!exit) {
          try {
            readLine = stdin.readLine();
          } catch(IOException e) {
            e.printStackTrace();
            continue;
          }
          if (readLine.equals("exit")) {
            exit = true;
          } else {
            System.err.println("Unknown comand: " + readLine);
            System.out.print("> ");
          }
        }
    }

}


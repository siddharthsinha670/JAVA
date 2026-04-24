
import java.util.Scanner;

public class cheak_character {

    public static void main(String[] args) {
        System.out.println("Enter the letter:- ");
        Scanner x = new Scanner(System.in);
        int ch;
        ch = x.next().charAt(0);
        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' || ch == 'A' || ch == 'E' || ch == 'I' || ch == 'O' || ch == 'U') {
            System.out.println("The entered letter is vowel letter.");
        }
    }

}

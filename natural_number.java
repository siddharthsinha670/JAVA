//Print sum of first 10 natural numbers

public class natural_number {
    public static void main(String[] args) {
        int sum = 0;

        for(int i = 1; i <= 10; i++) {
            sum = sum + i;
        }

        System.out.println("Sum = " + sum);
    }
}
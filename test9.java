//players

import java.util.Scanner;
class players
{
    private int name;
    private int no;
    public void input()
    {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter the name of the player:");
        name = sc.nextInt();
        System.out.println("Enter the jercy no of the player:");
        no = sc.nextInt();
    }
    public void show()
    {
        System.out.println("The name of the playerss is:"+name);
        System.out.println("The jercy number of the player is:"+no);
    }
}
public class test9
{
    public static void main(String args[])
    {
        players p1= new players();
        p1.input();
        p1.show();

    }
}
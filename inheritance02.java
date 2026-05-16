//Gamer → ProGamer

class game
{
    public game()
    {
        System.out.println("constructor of gamer");
    }
    public void game1()
    {
        System.out.println("I like football");
    }
    public void game2()
    {
        System.out.println("I like cricket");
    }
    public void game3()
    {
        System.out.println("I like formula 1");
    }
}
class Gamer extends game
{
    public Gamer()
    {
        System.out.println("Constructor of Gamer");
    }
    public void Gamer1()
    {
        System.out.println("My fav footballer is Cr7");
    }
    public void Gamer2()
    {
        System.out.println("My fav crickter is Virat kohli");
    }
    public void Gamer3()
    {
        System.out.println("My fav formula 1 driver is Lewis Hamilton");
    }
}
public class inheritance02
{
    public static void main(String args[])
    {
        Gamer gm = new Gamer();
        gm.game1();
        gm.Gamer1();

        gm.game2();
        gm.Gamer2();

        gm.game3();
        gm.Gamer3();

    }
}
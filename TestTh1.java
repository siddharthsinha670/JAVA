class A extends Thread
{
    public void run()
    {
        int x;
        try
        {
            for(x=10;x>=6;x--)
            {
                System.out.println(x);
                Thread.sleep(1000);
            }

        }
        catch(InterruptedException e)
        {

        }
    }
}
public class TestTh1
{
    public static void main(String[] args)throws InterruptedException
    {
        int i;
        A a1 = new A();
        a1.start();
        try
        {
            for(i=1;i<=5;i++)
            {
                System.out.println(i);
                Thread.sleep(400);
            }
        }
        catch(InterruptedException e)
        {

        }

    }
}
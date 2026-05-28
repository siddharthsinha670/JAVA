import java.io.File;
import java.io.IOException;

class CreateFile
{
    public static void main(String args[])
    {
        try
        {
            File f = new File("demo.txt");

            if(f.createNewFile())
            {
                System.out.println("File Created");
            }
            else
            {
                System.out.println("File Already Exists");
            }
        }
        catch(IOException e)
        {
            System.out.println(e);
        }
    }
}
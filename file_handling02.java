import java.io.FileWriter;
import java.io.IOException;

class WriterFile
{
    public static void main(String args[])
    {
       try
       {
        FileWriter fw = new FileWriter("Demo.txt");

        fw.write("Hello Sir");
        fw.write("\nWelcome tp java file Handling");

        fw.close();

        System.out.println("Date Written Sucessfully");
       }
       catch(IOException e)
       {
        System.out.println(e);
       }
    }
}

using System;
using System.IO;
using System.Text;

namespace API.Extra
{
    public static class GetSystemID
    {

        private static string _filePath = "./Extra/Last.txt";

        public static int GetLastID()
        {
            int ret = 1;
            using (StreamReader sw = File.OpenText(_filePath))
            {
                var a = sw.ReadLine();
                ret = int.Parse(a);
            }    
            return ret;
        }

        public static void UpdateID(int id)
        {
            File.WriteAllText(_filePath,$"{id}");
        } 
    }
}
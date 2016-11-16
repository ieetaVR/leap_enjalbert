using UnityEngine;
using System.Collections;

public class pinch_counter : MonoBehaviour {


    public Level_master masterLVL;
    public text_master bestText;
    //index, middle, ring, pinky
    public int[] totalCounts = { 0, 0, 0, 0 };
    public int[] currentCounts = { 0, 0, 0, 0 };
    public int workFlag = 1;
    public bool done = false;

	// Use this for initialization
	void Start () {
	
	}

    public void indexCount()
    {
        currentCounts[0]++;
    }

    public void middleCount()
    {
        currentCounts[1]++;
    }

    public void ringCount()
    {
        currentCounts[2]++;
    }

    public void pinkyCount()
    {
        currentCounts[3]++;
    }

    // Update is called once per frame
    void Update () {

        if(workFlag == 1)
        {
            bool taskComplete = true;

            //Debug.Log("state: " + currentCounts[0] + " " + totalCounts[0] + "      " + currentCounts[1] + " " + totalCounts[1] + "      " + currentCounts[2] + " " + totalCounts[2] + "      " + currentCounts[3] + " " + totalCounts[3]);

            for (int i = 0; i < totalCounts.Length; i++)
            {
                //Debug.Log("Comparing: " + currentCounts[i] + " " + totalCounts[i]);
                if (currentCounts[i] < totalCounts[i])
                {
                    taskComplete = false;
                    //Debug.Log("breaking on " + i.ToString());
                    break;
                }

                
            }

            if (taskComplete == true)
            {
                Debug.Log("Task done");
                bestText.setCurrentText("Task Completed!");
                masterLVL.taskFinalStage();
                done = true;
                workFlag = 0;
            }
        }

        
	}
}

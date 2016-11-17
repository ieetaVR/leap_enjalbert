using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Leap;

public class grab : MonoBehaviour {


    public Controller controller;
    //public text_change text_changeReference;
    //public TypeOutScript bestText;
    public text_master bestText;
    public change_color change_color_reference;
    public Level_master masterLVL;

    public bool opening_hand;
    public bool holding_hand;

    float t;
    int secsPassed;
    public int secsToWait;
    public int TotalIterations;
    int iterations;

    // Use this for initialization
    void Start () {

        opening_hand = true;

        //GameObject text3d = GameObject.Find("info_text");
        //text_changeReference = text3d.GetComponent<text_change>();
        //text_changeReference.setCurrentText("maybe!");
        controller = new Controller(); //An instance must exist
        byte[] frameData = System.IO.File.ReadAllBytes("frame.data");
        Frame reconstructedFrame = new Frame();
        reconstructedFrame.Deserialize(frameData);
    }
	
	// Update is called once per frame
	void Update () {
        

        if(iterations == TotalIterations)
        {
            masterLVL.taskFinalStage();
        }

        else
        {
            Frame frame = controller.Frame();
            if (frame.Hands.Count > 0)
            {

                //Debug.Log("num of hands: " + frame.Hands.Count);
                List<Hand> hands = frame.Hands;
                Hand firstHand = hands[0];
                //Debug.Log("Grab Angle: " + firstHand.GrabAngle);

                if (opening_hand)
                {
                    if (holding_hand == false)
                    {
                        //text_changeReference.setCurrentText("open your hand");
                        //bestText.FinalText = "open your hand";
                        //bestText.On = true;

                        change_color_reference.setColor(1 - firstHand.GrabAngle);

                        if (firstHand.GrabAngle == 0)
                        {

                            //text_changeReference.setCurrentText("Well done! Now hold.");
                            /*bestText.reset = true;
                            bestText.FinalText = "Well done! Now hold.";
                            bestText.On = true;*/
                            bestText.setCurrentText("Well done! Now hold.");
                            bestText.setCurrentText(" ");

                            holding_hand = true;

                            t = Time.time;
                            secsPassed = 0;
                            //StartCoroutine(TestCoroutine());

                        }
                    }
                    else
                    {
                        if (firstHand.GrabAngle > 0)
                        {

                            /*bestText.reset = true;
                            bestText.FinalText = "Please hold a little longer.\n Open your hand.";
                            bestText.On = true;*/
                            bestText.setCurrentText("Please hold a little longer.\n Open your hand.");
                            //opening_hand = false;
                            holding_hand = false;
                        }
                        else
                        {
                            float newT = Time.time;
                            secsPassed = (int)(newT - t);
                            bestText.setCurrentText("Well done! Now hold.");

                            //Debug.Log("secs passed: " + secsPassed.ToString());
                            if (secsPassed >= secsToWait)
                            {


                                opening_hand = false;
                                holding_hand = false;
                                iterations++;

                                if(iterations < TotalIterations)
                                {
                                    /*bestText.reset = true;
                                    bestText.FinalText = "Well done!\n Now close your hand";
                                    bestText.On = true;*/
                                    bestText.setCurrentText("Well done!\n Now close your hand");
                                }
                                else
                                {
                                    bestText.setCurrentText("Task Completed.");
                                    bestText.setCurrentText("Task Completed!");
                                }

                            }
                        }
                    }

                }
                else
                {
                    if (holding_hand == false)
                    {
                        //text_changeReference.setCurrentText("close your hand");

                        change_color_reference.setColor(firstHand.GrabAngle / 3.14f);

                        if (firstHand.GrabAngle > 3.14)
                        {
                            //text_changeReference.setCurrentText("Well done! now hold");
                            /*bestText.FinalText = "Well done! Now hold.";
                            bestText.On = true;*/
                            bestText.setCurrentText("Well done! Now hold.");
                            bestText.setCurrentText(" ");


                            //StartCoroutine(TestCoroutine());
                            //opening_hand = true;
                            holding_hand = true;


                            t = Time.time;
                            secsPassed = 0;


                        }
                    }
                    else
                    {
                        if (firstHand.GrabAngle < 3.14)
                        {
                            //opening_hand = true;
                            /*bestText.reset = true;
                            bestText.FinalText = "Please hold a little longer.\n Close your hand.";
                            bestText.On = true;*/
                            bestText.setCurrentText("Please hold a little longer.\n Close your hand.");

                            holding_hand = false;
                        }
                        else
                        {
                            float newT = Time.time;
                            secsPassed = (int)(newT - t);
                            bestText.setCurrentText("Well done! Now hold.");

                            //Debug.Log("secs passed: " + secsPassed.ToString());
                            if (secsPassed >= secsToWait)
                            {

                                opening_hand = true;
                                holding_hand = false;
                                iterations++;

                                if (iterations < TotalIterations)
                                {
                                    /*bestText.reset = true;
                                    bestText.FinalText = "Well done!\n Now open your hand";
                                    bestText.On = true;*/
                                    bestText.setCurrentText("Well done!\n Now open your hand");
                                }
                                else
                                {
                                    bestText.setCurrentText("Task Completed.");
                                    bestText.setCurrentText("Task Completed!");
                                }

                            }
                        }
                    }
                }
            }
            else
            {
                Debug.Log("no hands!");
            }
        }

        
    
    }

    public bool running;

    IEnumerator TestCoroutine()
    {
        running = true;

        while (running)
        {
            Debug.Log("TestCoroutine()");
            yield return new WaitForSeconds(3);
        }
    }
}

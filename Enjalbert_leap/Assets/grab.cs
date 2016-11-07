using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Leap;

public class grab : MonoBehaviour {


    public Controller controller;
    public text_change text_changeReference;
    public change_color change_color_reference;
    public bool opening_hand;
    public bool holding_hand;

    // Use this for initialization
    void Start () {

        opening_hand = true;

        GameObject text3d = GameObject.Find("info_text");
        text_changeReference = text3d.GetComponent<text_change>();
        text_changeReference.setCurrentText("maybe!");

        controller = new Controller(); //An instance must exist
        byte[] frameData = System.IO.File.ReadAllBytes("frame.data");
        Frame reconstructedFrame = new Frame();
        reconstructedFrame.Deserialize(frameData);
    }
	
	// Update is called once per frame
	void Update () {
        

        Frame frame = controller.Frame();
        if (frame.Hands.Count > 0)
        {

            Debug.Log("num of hands: " + frame.Hands.Count);
            List<Hand> hands = frame.Hands;
            Hand firstHand = hands[0];
            Debug.Log("grab_strength: " + firstHand.GrabAngle);

            if (opening_hand)
            {
                if(holding_hand == false)
                {
                    text_changeReference.setCurrentText("open your hand");
                    change_color_reference.setColor(1 - firstHand.GrabAngle);

                    if (firstHand.GrabAngle == 0)
                    {
                        text_changeReference.setCurrentText("Well done! Now hold.");
                        holding_hand = true;
                        //StartCoroutine(TestCoroutine());
                        


                    }
                }
                else
                {
                    if(firstHand.GrabAngle > 0)
                    {
                        opening_hand = false;
                        holding_hand = false;
                    }
                }
                
            }
            else
            {
                if (holding_hand == false)
                {
                    text_changeReference.setCurrentText("close your hand");
                    change_color_reference.setColor(firstHand.GrabAngle/3.14f);

                    if (firstHand.GrabAngle > 3.14)
                    {
                        text_changeReference.setCurrentText("Well done! now hold");
                        //StartCoroutine(TestCoroutine());
                        //opening_hand = true;
                        holding_hand = true;


                    }
                }
                else
                {
                    if (firstHand.GrabAngle < 3.14)
                    {
                        opening_hand = true;
                        holding_hand = false;
                    }
                }
            }
        }
        else
        {
            Debug.Log("no hands!");
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

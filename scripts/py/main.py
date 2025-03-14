from typing import List
import json
import os
import requests
import time
from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_TOKEN"))

questions = [
    {
      "question_id": 1,
      "question_name": "Respect for Elders",
      "raw_question": "S/he believes s/he should always show respect to his/her parents and to older people. It is important to him/her to be obedient."
    },
    {
      "question_id": 2,
      "question_name": "Religious Belief",
      "raw_question": "Religious belief is important to him/her. S/he tries hard to do what his religion requires."
    },
    {
      "question_id": 3,
      "question_name": "Helping Others",
      "raw_question": "It's very important to him/her to help the people around him/her. S/he wants to care for their well-being."
    },
    {
      "question_id": 4,
      "question_name": "Equality",
      "raw_question": "S/he thinks it is important that every person in the world be treated equally. S/he believes everyone should have equal opportunities in life."
    },
    {
      "question_id": 5,
      "question_name": "Curiosity",
      "raw_question": "S/he thinks it's important to be interested in things. S/he likes to be curious and to try to understand all sorts of things."
    },
    {
      "question_id": 6,
      "question_name": "Adventure",
      "raw_question": "S/he likes to take risks. S/he is always looking for adventures."
    },
    {
      "question_id": 7,
      "question_name": "Enjoyment",
      "raw_question": "S/he seeks every chance he can to have fun. It is important to him/her to do things that give him/her pleasure."
    },
    {
      "question_id": 8,
      "question_name": "Ambition",
      "raw_question": "Getting ahead in life is important to him/her. S/he strives to do better than others."
    },
    {
      "question_id": 9,
      "question_name": "Leadership",
      "raw_question": "S/he always wants to be the one who makes the decisions. S/he likes to be the leader."
    },
    {
      "question_id": 10,
      "question_name": "Orderliness",
      "raw_question": "It is important to him/her that things be organized and clean. S/he really does not like things to be a mess."
    },
    {
      "question_id": 11,
      "question_name": "Proper Behavior",
      "raw_question": "It is important to him/her to always behave properly. S/he wants to avoid doing anything people would say is wrong."
    },
    {
      "question_id": 12,
      "question_name": "Tradition",
      "raw_question": "S/he thinks it is best to do things in traditional ways. It is important to him/her to keep up the customs s/he has learned."
    },
    {
      "question_id": 13,
      "question_name": "Responsiveness",
      "raw_question": "It is important to him/her to respond to the needs of others. S/he tries to support those s/he knows."
    },
    {
      "question_id": 14,
      "question_name": "World Peace",
      "raw_question": "S/he thinks it is best for all the world's people to live in harmony. Promoting peace among all groups in the world is important to him/her."
    },
    {
      "question_id": 15,
      "question_name": "Creativity",
      "raw_question": "Thinking up new ideas and being creative is important to him/her. S/he likes to do things in his/her own original way."
    },
    {
      "question_id": 16,
      "question_name": "Variety",
      "raw_question": "S/he thinks it is important to do lots of different things in life. S/he always looks for new things to try."
    },
    {
      "question_id": 17,
      "question_name": "Enjoyment of Life",
      "raw_question": "S/he really wants to enjoy life. Having a good time is very important to him/her."
    },
    {
      "question_id": 18,
      "question_name": "Success",
      "raw_question": "Being very successful is important to him/her. S/he likes to impress other people."
    },
    {
      "question_id": 19,
      "question_name": "Authority",
      "raw_question": "It is important to him/her to be in charge and tell others what to do. S/he wants people to do what s/he says."
    },
    {
      "question_id": 20,
      "question_name": "Social Order",
      "raw_question": "Having a stable government is important to him/her. S/he is concerned that the social order be protected."
    }
  ]

def get_yes_no_prompts(question) -> List[str]:
    """
    Generate two image prompts based on the question using OpenAI's API.
    One prompt for 'yes' and one for 'no' to the question.
    
    Args:
        question (dict): Question dictionary containing raw_question
        
    Returns:
        List[str]: List of two prompts [yes_prompt, no_prompt]
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates image prompts."},
                {"role": "user", "content": f"Based on this question: '{question['raw_question']}', create two detailed image prompts. The first prompt should represent someone who strongly agrees with this value, and the second prompt should represent someone who strongly disagrees. Make the prompts vivid and suitable for image generation. Return only the two prompts separated by a newline, without any additional text."}
            ],
            temperature=0.7,
            max_tokens=300
        )
        
        # Extract the two prompts from the response
        prompts_text = response.choices[0].message.content.strip().split('\n')
        # Clean up any numbering or extra formatting
        prompts = [p.strip() for p in prompts_text if p.strip()]
        
        # Ensure we have exactly two prompts
        if len(prompts) >= 2:
            return prompts[:2]
        else:
            # If we don't have enough prompts, create generic ones
            return [
                f"A person who values {question['question_name']} highly",
                f"A person who does not value {question['question_name']}"
            ]
            
    except Exception as e:
        print(f"Error generating prompts for question {question['question_id']}: {e}")
        return [
            f"A person who values {question['question_name']} highly",
            f"A person who does not value {question['question_name']}"
        ]

def get_image_by_prompt(prompt: str, output_name: str) -> bool:
    """
    Generate an image based on the given prompt using OpenAI's DALL-E API.
    
    Args:
        prompt (str): The prompt to generate an image from
        output_name (str): The filename to save the image as
        
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Create output directory if it doesn't exist
        output_dir = "generated_images"
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate image
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        
        # Get image URL
        image_url = response.data[0].url
        
        # Download the image
        image_response = requests.get(image_url)
        if image_response.status_code == 200:
            with open(os.path.join(output_dir, f"{output_name}.png"), "wb") as f:
                f.write(image_response.content)
            return True
        else:
            print(f"Failed to download image: {image_response.status_code}")
            return False
            
    except Exception as e:
        print(f"Error generating image for prompt '{prompt}': {e}")
        return False

def main():
    """
    Main function to process all questions, generate prompts and images.
    """
    for question in questions:
        print(f"Processing question {question['question_id']}: {question['question_name']}")
        
        # Generate prompts
        prompts = get_yes_no_prompts(question)
        print(f"Generated prompts: {prompts}")
        
        # Generate images for each prompt
        for i, prompt in enumerate(prompts):
            output_name = f"q{question['question_id']}_{i+1}"
            print(f"Generating image for prompt: {prompt}")
            success = get_image_by_prompt(prompt, output_name)
            if success:
                print(f"Successfully generated image: {output_name}")
            else:
                print(f"Failed to generate image for {output_name}")
            
            # Add a small delay to avoid rate limiting
            time.sleep(2)

if __name__ == "__main__":
    main()

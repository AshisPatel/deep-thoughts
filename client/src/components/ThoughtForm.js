import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_THOUGHT } from "../utils/mutations";
import { QUERY_ME, QUERY_THOUGHTS } from "../utils/queries";

const ThoughtForm = () => {

    const [thoughtText, setText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        // this update method forces all of our QUERY_THOUGHTS queries to have their cache's updated
        // We need to do this because our addThought is adding a new value to the cache'd version of the QUERY_THOUGHTS query
        // This needs to be done because QUERY_THOUGHTS occurs when we load the homepage, which is one of the possible locations to add a thought
        // The other cached query that needs to be updated is the QUERY_ME which returns the user's thoughts in their profile 
        // We perform a try...catch block on writing to the QUERY_THOUGHTS cache because the user may not have visited the homepage prior to accessing their profile and adding a thought
        // Therefore, the QUERY_THOUGHTS cache does not exist and can not be written to. The try...catch will stop the code from stopping here on error. 
        update(cache, { data: { addThought } }) {
            try {
                // read what is currently in the cache
                const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
                // add our new thought to the cache
                cache.writeQuery({
                    query: QUERY_THOUGHTS,
                    data: { thoughts: [addThought, ...thoughts] }
                });
            } catch (err) {
                console.error(err);
            }

            const { me } = cache.readQuery({ query: QUERY_ME });
            cache.writeQuery({
                query: QUERY_ME,
                data: { me: { ...me, thoughts: [...me.thoughts, addThought]}}
            });
        }
    });

    const handleChange = (e) => {
        const { value } = e.target;
        if (value.length <= 280) {
            setText(value);
            setCharacterCount(value.length);
        }

    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await addThought({
                variables: { thoughtText }
            });
            setText('');
            setCharacterCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <p className={`m-0 ${characterCount === 280 || error && 'text-error'}`}>
                Character Count: {characterCount}/280
                {error && <span> Something went wrong! Sorry friend. (^^;)</span>}
            </p>
            <form
                className="flex-row justify-center justify-space-between-md align-stretch"
                onSubmit={handleFormSubmit}
            >
                <textarea
                    placeholder="Here's a new thought..."
                    className="form-input col-12 col-md-9"
                    value={thoughtText}
                    onChange={handleChange}
                    disabled={characterCount > 280 ? true : false}
                ></textarea>
                <button className="btn col-12 col-md-3" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ThoughtForm;

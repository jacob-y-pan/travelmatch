import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const MainPage = ( { session }) => {
    const [jobs, setJobs] = useState([]);
    const [currentJob, setCurrentJob] = useState(0);
    const [myJobs, setMyJobs] = useState([]);

    useEffect(() => {
        if (session)
            getJobs();
        return
    }, []);

    async function getJobs() {
        const {data, error} = await supabase.from("jobs").select();
        if (error) {
            console.log(error);
        }
        setJobs(data);
    }

    function getElements() {
        return jobs.slice(currentJob, currentJob+1).map(el => {
          return <div>Hospital: {el.hospital}| Position: {el.position} | Length of Position (in weeks): {el.length} | Start date: {el.start_date}</div>;
        });
      }

    function handleYes() {
        let jobId = currentJob + 1
        addJobToUser(jobId);
        setCurrentJob(currentJob + 1)
    }

    async function addJobToUser(jobId) {
        // Make sure stuff in there
        let user_id = (await supabase.auth.getSession()).data.session.user.id
        const {data,error1} = await supabase.from('user_info').select('saved_jobs').eq('user_id', user_id)
        let cur_saved_jobs = []
        if (data[0] !== undefined) {
            cur_saved_jobs = data[0].saved_jobs
        }
        cur_saved_jobs.push(parseInt(jobId))
        const {error2} = await supabase.from('user_info').upsert({user_id: user_id, saved_jobs: cur_saved_jobs})
    }

    function handleNo() {
        setCurrentJob(currentJob + 1)
    }

    const handleLogout = async () => {
        supabase.auth.signOut().catch(console.error);
    };

    async function seePickedJobs() {
        let user_id = (await supabase.auth.getSession()).data.session.user.id
        const {data,error1} = await supabase.from('user_info').select('saved_jobs').eq('user_id', user_id)
        let cur_saved_jobs = data[0].saved_jobs
        let saved_jobs = []
        cur_saved_jobs.map(async (job_id) => {
            let job = jobs[job_id-1]
            saved_jobs.push(job)
        })

        setMyJobs(saved_jobs)
    }

    return (
        <div>
            <div style={{marginBottom: 40}}>
            <button
                onClick={seePickedJobs}
                className={
                    "flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                }
            >See Profile
            </button>
            <br />
            {myJobs.length === 0 ? <div></div> : (
                <div>
                    My Saved Jobs
                    {
                        myJobs.map((job) => {
                            return <div>Hospital: {job.hospital}| Position: {job.position} | Length of Position (in weeks): {job.length} | Start date: {job.start_date}</div>
                        })
                    }
                </div>
            )}
            </div>
            <div style={{borderStyle: "solid"}}>
            <h2>Available jobs</h2>
            {jobs === undefined ? <div>Loading current jobs...</div> : <div>
                {getElements()}
                <button className='btn' onClick={handleYes}>Yes</button>
                <button className='btn' onClick={handleNo}>No</button>
            </div>}
            </div>
            <div style={{marginTop: 20}}>
        <button
                onClick={handleLogout}
                className={
                    "flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                }
            >
                Logout
            </button>
            </div>
        </div>
    )
}

export default MainPage;
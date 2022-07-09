import {Message_attachments} from "@generated";
import {
  VideoAttachmentBase,
  VideoAttachmentContainerBase,
  VideoAttachmentOverlay
} from "@ui/Messages/Content/Attachment/elements";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import fileSize from "filesize";
import Tooltip from "rc-tooltip";
import useSize from "@ui/Messages/Content/Attachment/useSize";

interface VideoAttachmentProps {
  attachment: Message_attachments;
}

function VideoAttachment(props: VideoAttachmentProps) {
  const [hasPlayedOnceBefore, setHasPlayedOnceBefore] = useState(false);
  const [paused, setPaused] = useState(true);
  const [showPlayOrPauseAnimation, setShowPlayOrPauseAnimation] = useState(false);
  const [durationPlayed, setDurationPlayed] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  const videoRef = useRef(null);
  const attachmentRef = useRef(null);

  const durationPlayedHumanized = useMemo(
    () => {
      const minutesPassed = Math.floor(videoRef.current?.currentTime / 60);
      const secondsPassedRaw = Math.floor(videoRef.current?.currentTime % 60);
      const secondsPassed = secondsPassedRaw < 10 ? `0${secondsPassedRaw}` : secondsPassedRaw;

      const minutesTotal = Math.floor(videoRef.current?.duration / 60);
      const secondsTotalRaw = Math.floor(videoRef.current?.duration % 60);
      const secondsTotal = secondsTotalRaw < 10 ? `0${secondsTotalRaw}` : secondsTotalRaw;

      return `${minutesPassed}:${secondsPassed}/${minutesTotal}:${secondsTotal}`;
    },
    [durationPlayed, videoRef.current]
  );

  const playVideo = () => {
    const video = videoRef.current;

    if (video === null)
      return;

    if (video.paused)
      video.play();
    else
      video.pause();
  }

  const updatePauseState = useCallback((pauseState: boolean) => {
    setPaused(pauseState);
    setShowPlayOrPauseAnimation(true);
    setTimeout(() => setShowPlayOrPauseAnimation(false), VideoAttachmentOverlay.PlayOrPauseAnimationDuration);
  }, [])

  const { width, height } = useSize(props.attachment.width, props.attachment.height, isFullscreen);

  const fullScreenChange = () => {
    setIsFullscreen(document.fullscreenElement !== null);
  }

  const seekVideo = (e) => {
    if (videoRef.current === null || !isSeeking)
      return;

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;

    const duration = videoRef.current?.duration;
    if (duration === undefined)
      return;

    videoRef.current.currentTime = x / rect.width * duration;
  }

  useEffect(
    () => {
      document.addEventListener("fullscreenchange", fullScreenChange);

      return () => {
        document.removeEventListener("fullscreenchange", fullScreenChange);
      }
    },
    [],
  );

  return (
    <div className={VideoAttachmentContainerBase} style={{width, height}} ref={attachmentRef}>
      <video
        className={VideoAttachmentBase}
        preload="metadata"
        src={props.attachment.url}
        height={height}
        width={width}
        ref={videoRef}
        onPause={() => updatePauseState(true)}
        onPlay={() => {
          updatePauseState(false);
          setHasPlayedOnceBefore(true);
        }}
        onTimeUpdate={({timeStamp}) => setDurationPlayed(timeStamp)}
      />
      <VideoAttachmentOverlay.Base data-paused={paused} data-played-once={hasPlayedOnceBefore}>
        {showPlayOrPauseAnimation && (
          <VideoAttachmentOverlay.PlayOrPauseButtonAnimation data-paused={paused} />
        )}
        <VideoAttachmentOverlay.MetadataBase>
          <VideoAttachmentOverlay.MetadataTitleBase>
            {props.attachment.filename}
          </VideoAttachmentOverlay.MetadataTitleBase>
          <VideoAttachmentOverlay.MetadataFilesizeBase>
            {fileSize(props.attachment.size, {base: 2})}
          </VideoAttachmentOverlay.MetadataFilesizeBase>
        </VideoAttachmentOverlay.MetadataBase>
        <VideoAttachmentOverlay.Control onClick={playVideo} />
        <VideoAttachmentOverlay.VideoControlsBase>
          <VideoAttachmentOverlay.PlayOrPauseButtonBase data-paused={paused} />
          {width > 200 && (
            <VideoAttachmentOverlay.VideoControlsTimeBase>
              {durationPlayedHumanized}
            </VideoAttachmentOverlay.VideoControlsTimeBase>
          )}
          <VideoAttachmentOverlay.ProgressBarBase
            onMouseMove={seekVideo}
            onMouseDown={() => setIsSeeking(true)}
            onMouseUp={() => setIsSeeking(false)}
          >
            <VideoAttachmentOverlay.ProgressBarFillBase
              className="progress-bar-fill"
              style={{
                width: videoRef.current?.currentTime / videoRef.current?.duration * 100 + "%"
              }}
            />
          </VideoAttachmentOverlay.ProgressBarBase>
          <Tooltip overlay="Warning, bugs be here!" placement="top">
            <VideoAttachmentOverlay.FullscreenButtonBase
              onClick={() => {
                if (document.fullscreenElement === null)
                  attachmentRef.current?.requestFullscreen();
                else
                  document.exitFullscreen();
              }}
            />
          </Tooltip>
        </VideoAttachmentOverlay.VideoControlsBase>
      </VideoAttachmentOverlay.Base>
    </div>
  );
}

export default VideoAttachment;
